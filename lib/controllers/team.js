var React = require('react');
var moment = require('moment-timezone');

var render = require('../helpers/render.js');
var transform = require('../../app/utils/transform.js');
var strings = require('../../app/utils/strings.js');
var App = require('../../app/views/app.jsx');

var people = require('../../people.json');

var team = module.exports = {};

team.index = function(req, res) {
  
  // Organize into timezones
  var time = moment();
  var timezones = transform(time, people);
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
    title: strings.capFirst(req.params.name),
    body: body,
    script: 'bundles/app.js',
    data: {
      time: time,
      people: people,
      timeFormat: timeFormat
    }
  };

  render(req, res, params);

};