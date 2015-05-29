var moment = require('moment-timezone');

var UserModel = require('../models/user.js');
var TeamModel = require('../models/team.js');
var transform = require('../../app/utils/transform.js');
var strings = require('../../app/utils/strings.js');
var Team = require('../../app/views/team.jsx');


var team = module.exports = {};

team.index = function(req, res, next) {
  var slug = req.params.name;
  var validViews = ['manage'];
  var view = validViews.indexOf(req.params.view) > -1 ? req.params.view : 'app';

  TeamModel.findOne({ slug: slug }, function(err, team) {
    if (err) return next(err);

    // Team not found
    if (!team) return next();

    UserModel.findAllByTeam(team._id, function(err, users) {
      if (err) return next(err);

      // Organize into timezones
      var time = moment();
      var timezones = transform(time, users);
      var timeFormat = 12; // hardcode default for now

      res.render('team', {
        title: strings.capFirst(team.name || ''),
        people: users,
        isAdmin: team.isAdmin(req.user),
        time: time,
        team: team,
        timezones: timezones,
        timeFormat: timeFormat,
        isCurrentTime: true,
        currentView: view
      });

    });

  });

};

team.create = function(req, res, next) {



};
