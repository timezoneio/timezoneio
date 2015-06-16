var moment = require('moment-timezone');

var UserModel = require('../models/user.js');
var TeamModel = require('../models/team.js');
var LocationModel = require('../models/location.js');

var api = module.exports = {};

var TEAM_WRITABLE_FIELDS = ['name'];

var handleError = function(res, message) {
  res.status(500).json({
    message: message || 'Something bad happened'
  });
};

api.userCreate = function(req, res, next) {

  var userData = req.body;

  // could be DRYer
  if (!userData.email)
    return handleError(res, 'An email is required');
  if (!userData.name)
    return handleError(res, 'An name is required');
  if (!userData.location)
    return handleError(res, 'An location is required');
  if (!userData.timezone)
    return handleError(res, 'An timezone is required');

  UserModel.findOne({ email: email }, function(err, user) {

    // NOTE - in the future we should do a search before creating user
    if (user) return handleError(res, 'That user already exists!');

    var validData = {};
    for (var key in userData) {
      if (UserModel.WRITABLE_FIELDS.indexOf(key) > -1) {
        validData[key] = userData[key];
      }
    }

    var newUser = new UserModel(validData);

    newUser.save(function() {
      if (err) return handleError(res, 'Failed to save');
      res.json(newUser);
    });


  });

};

api.userUpdate = function(req, res, next) {

  var id = req.params.id;

  UserModel.findOne({ _id: id }, function(err, user) {
    if (err) return handleError(res, 'Couldn\'t find that user!');

    if (!user.isOnTeam(req.team))
      return handleError(res, 'Hey, that user isn\'t on your team!');

    // replace w/ underscore
    for (var key in req.body) {
      if (UserModel.WRITABLE_FIELDS.indexOf(key) > -1) {
        user[key] = req.body[key];
      }
    }

    user.save(function(err) {
      if (err) return handleError(res, 'Failed to save');
      res.json(user);
    });

  });

};

api.teamUpdate = function(req, res, next) {

  var team = req.team;

  // replace w/ underscore
  for (var key in req.body) {
    if (TEAM_WRITABLE_FIELDS.indexOf(key) > -1) {
      team[key] = req.body[key];
    }
  }

  team.save(function(err) {
    if (err) return handleError(res, 'Failed to save');
    res.json(team);
  });

};

api.locationSearch = function(req, res, next) {

  var query = req.query.q;

  if (!query) {
    return res.status(400).json({
      message: 'q parameter required'
    });
  }

  // NOTE - maybe more data validation?

  LocationModel.findByQuery(query, 5, function(err, locations) {
    if (err) return handleError(res);

    res.json({ results: locations });
  });

};
