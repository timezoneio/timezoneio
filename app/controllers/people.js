var moment = require('moment-timezone');

var User = require('../models/user.js');
var Team = require('../models/team.js');
var transform = require('../../app/utils/transform.js');
var strings = require('../../app/utils/strings.js');

var people = module.exports = {};

people.index = function(req, res, next) {
  var username = req.params.username;

  User.findOneByUsername(username, function(err, user) {

    var teamIds = user.teams.map(function(t) { return t.teamId; });

    Team.findInfoByIds(teamIds, function(err, teams) {

      var time = moment();
      var timeFormat = 12; // hardcode default for now

      res.render('person', {
        title: strings.capFirst(user.name || ''),
        user: user,
        teams: teams,
        time: time,
        timeFormat: timeFormat
      });

    });

  });

};
