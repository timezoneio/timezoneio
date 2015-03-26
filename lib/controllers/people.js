var User = require('../models/user.js');
var Team = require('../models/team.js');

var React = require('react');
var moment = require('moment-timezone');

var render = require('../helpers/render.js');
var transform = require('../../app/utils/transform.js');
var strings = require('../../app/utils/strings.js');
var Person = require('../../app/views/person.jsx');

var people = module.exports = {};

people.index = function(req, res, next) {
  var username = req.params.username;

  User.findOneByUsername(username, function(err, user) {

    var time = moment();
    var timeFormat = 12; // hardcode default for now

    var body = React.renderToString(
      Person({
        user: user,
        time: time,
        timeFormat: timeFormat,
      })
    );

    var params = {
      title: strings.capFirst(user.name || ''),
      body: body,
      script: 'bundles/person.js',
      data: {
        user: user,
        time: time,
        timeFormat: timeFormat
      }
    };

    render(req, res, params);

  });

};
