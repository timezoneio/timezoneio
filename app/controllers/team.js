var UserModel = require('../models/user.js');
var TeamModel = require('../models/team.js');

var React = require('react');
var moment = require('moment-timezone');

var render = require('../helpers/render.js');
var transform = require('../../app/utils/transform.js');
var strings = require('../../app/utils/strings.js');
var Team = require('../../app/views/team.jsx');


var team = module.exports = {};

team.index = function(req, res, next) {
  var slug = req.params.name;

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

      var body = React.renderToString(
        Team({
          time: time,
          timezones: timezones,
          timeFormat: timeFormat,
          isCurrentTime: true
        })
      );

      var params = {
        title: strings.capFirst(team.name || ''),
        body: body,
        script: 'bundles/team.js',
        data: {
          time: time,
          people: users,
          timeFormat: timeFormat
        }
      };

      render(req, res, params);

    });

  });

};

team.create = function(req, res, next) {



};