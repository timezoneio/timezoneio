var moment = require('moment-timezone');

var UserModel = require('../models/user.js');
var TeamModel = require('../models/team.js');
var transform = require('../../app/utils/transform.js');
var strings = require('../../app/utils/strings.js');
var Team = require('../../app/views/team.jsx');


var team = module.exports = {};

team.index = function(req, res, next) {
  var slug = req.params.name;
  var VALID_VIEWS = ['manage'];
  var DEFAULT_VIEW = 'app';
  var view = VALID_VIEWS.indexOf(req.params.view) > -1 ? req.params.view : DEFAULT_VIEW;

  TeamModel.findOne({ slug: slug }, function(err, team) {
    if (err) return next(err);

    // Team not found
    if (!team) return next();

    var isAdmin = team.isAdmin(req.user);

    UserModel.findAllByTeam(team._id, function(err, users) {
      if (err) return next(err);

      // Organize into timezones
      var time = moment();
      var timezones = transform(time, users);
      var timeFormat = 12; // hardcode default for now

      var people = !isAdmin ?
                    users :
                    users.map(function(u) { return u.toAdminJSON(); });

      res.render('team', {
        title: strings.capFirst(team.name || ''),
        people: people,
        isAdmin: isAdmin,
        time: time,
        team: team,
        timezones: timezones,
        timeFormat: timeFormat,
        isCurrentTime: true,
        currentView: isAdmin ? view : DEFAULT_VIEW
      });

    });

  });

};

team.create = function(req, res, next) {



};
