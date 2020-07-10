'use strict';
var async = require('async')
var UserModel = require('../models/user');
var TeamModel = require('../models/team');
var TeamMemberModel = require('../models/teamMember');
var sendEmail = require('..//email/send');

var account = module.exports = {};

account.index = function(req, res) {

  res.render('Account', {
    message: req.flash('message'),
    errors: req.flash('error'),
    title: 'Account',
    userSettings: req.user.getAllUserSettings()
  });

};

account.saveAccountInfo = function(req, res) {

  for (var key in req.body) {
    if (UserModel.ADMIN_WRITABLE_FIELDS.indexOf(key) > -1) {
      req.user[key] = key === 'email' ? req.body[key].toLowerCase() : req.body[key];
    }
  }

  if (req.body.settings) {
    for (let name in req.body.settings) {
      req.user.setUserSetting(name, req.body.settings[name]);
    }
  }

  req.user.save(function(err) {
    if (err) {
      let message = err.message
      if (err.errors) {
        message = Object.keys(err.errors).map((key) => err.errors[key].message).join(', ')

      // TODO - Cleanup, move this elsewhere
      } else if (err.code === 11000) {
        const matches = err.message.match(/index: (\w+)_1/)
        const field = matches && matches.length === 2 && matches[1]
        message = field ? `${field} already exists` : err.message
      }
      req.flash('error', `There was an issue: ${message}`);
    } else {
      req.flash('message', 'All your changes have been saved. Sweet.');
    }

    res.redirect('/account');
  });

};

account.deleteAccount = function(req, res, next) {
  const confirmation = req.body.confirmation
  const reason = req.body.reason

  if (!confirmation || confirmation.toLowerCase() !== 'delete') {
    return next(new Error('Missing DELETE confirmation text'))
  }

  var handleDeleteFailure = function () {
    req.flash('error', 'We were unable to delete your account, please email us at hi@timezone.io');
    res.redirect('/account');
  }

  TeamModel
    .findAllByUser(req.user)
    .then(function (teams) {
      var teamsToDelete = teams.filter(function (team) {
        return team.isAdmin(req.user)
      })

      // Send the reason to the admin email to track why people are leaving
      // sendEmail('accountDeleteAdminNotification', 'hi@timezone.io', {
      //   userEmail: req.user.email,
      //   userName: req.user.name,
      //   reason: reason,
      //   teamNames: teamsToDelete.map(function (t) { return t.name }).join(', '),
      // })

      async.eachSeries(teams, function (team, done) {
        if (team.isAdmin(req.user)) {
          TeamModel
            .removeById(team._id)
            .then(done, done)
        } else {
          team.removeTeamMember({ _id: req.user._id })
          done()
        }
      }, function (results) {
        UserModel
          .remove({ _id: req.user._id })
          .then(function () {
            req.logout();
            req.flash('message', 'Your account has been deleted. Sorry to see you go!');
            res.redirect('/login');
          }, handleDeleteFailure);
      }, handleDeleteFailure);
    }, handleDeleteFailure);
}
