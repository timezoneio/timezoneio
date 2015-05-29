var moment = require('moment-timezone');

var UserModel = require('../models/user.js');
var TeamModel = require('../models/team.js');

var api = module.exports = {};

var TEAM_WRITABLE_FIELDS = ['name'];

var handleError = function(res, message) {
  res.status(500).json({
    message: message || 'Something bad happened'
  });
};

api.teamUpdate = function(req, res, next) {

  var id = req.params.id;

  TeamModel.findOne({ _id: id }, function(err, team) {
    if (err) return handleError('Couldn\'t find that team');

    if (!team.isAdmin(req.user)) {
      return res.status(403).json({
        message: 'Forbidden'
      });
    }

    // replace w/ underscore
    for (var key in req.body) {
      if (TEAM_WRITABLE_FIELDS.indexOf(key) > -1) {
        team[key] = req.body[key];
      }
    }

    team.save(function(err) {
      if (err) return handleError('Failed to save');
      res.json(team);
    });


  });

};
