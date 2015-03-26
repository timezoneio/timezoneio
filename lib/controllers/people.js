var User = require('../models/user.js');
var Team = require('../models/team.js');

var React = require('react');
var moment = require('moment-timezone');

var render = require('../helpers/render.js');
var transform = require('../../app/utils/transform.js');
var strings = require('../../app/utils/strings.js');
var App = require('../../app/views/app.jsx');

var people = require('../../people.json');

var people = module.exports = {};

people.index = function(req, res, next) {
  var username = req.params.username;

  User.find({ 'teams.teamId': team._id }, function(err, users) {

    var time = moment();
    var timeFormat = 12; // hardcode default for now

    var body = React.renderToString(
      App({
        time: time,
        timezones: timezones,
        timeFormat: timeFormat,
        isCurrentTime: true
      })
    );

    var params = {
      title: strings.capFirst(team.name || ''),
      body: body,
      script: 'bundles/app.js',
      data: {
        user: 1,
        time: time,
        timeFormat: timeFormat
      }
    };

    render(req, res, params);


  });

};
