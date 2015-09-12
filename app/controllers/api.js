var crypto = require('crypto');
var moment = require('moment-timezone');
var getTimezoneFromLocation = require('../helpers/getTimezoneFromLocation');
var getCityFromCoords = require('../helpers/getCityFromCoords');

var UserModel = require('../models/user.js');
var TeamModel = require('../models/team.js');
var LocationModel = require('../models/location.js');
var APIClientModel = require('../../app/models/apiClient.js');
var APIAuthModel = require('../../app/models/apiAuth.js');

var api = module.exports = {};

var TEAM_WRITABLE_FIELDS = ['name'];

// FIX THIS TO RETURN 400s ALSO
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
  if (!userData.tz)
    return handleError(res, 'An timezone is required');

  UserModel.findOne({ email: userData.email }, function(err, user) {

    // NOTE - in the future we should do a search before creating user
    if (user) return handleError(res, 'That user already exists!');

    var validData = {};
    for (var key in userData) {
      if (UserModel.ADMIN_WRITABLE_FIELDS.indexOf(key) > -1) {
        validData[key] = userData[key];
      }
    }

    var newUser = new UserModel(validData);

    // Add user to team
    req.team.addTeamMember(newUser);
    req.team.save(function(err) {
      if (err) return handleError(res, 'Failed to save: ' + err);
      newUser.save(function(err) {
        if (err) return handleError(res, 'Failed to save: ' + err);
        res.json(newUser);
      });
    });

  });

};

api.userGet = function(req, res, next) {
  res.carset = 'utf-8'; //('Content-Type', 'application/json;charset=utf-8');
  res.json(req.activeUser);
};

api.userUpdate = function(req, res, next) {

  var user = req.activeUser;

  // if (!user.isOnTeam(req.team))
    // return handleError(res, 'Hey, that user isn\'t on your team!');

  // replace w/ underscore
  for (var key in req.body) {
    if (UserModel.ADMIN_WRITABLE_FIELDS.indexOf(key) > -1) {
      user[key] = req.body[key];
    }
  }

  user.save(function(err) {
    if (err) return handleError(res, 'Failed to save');
    res.json(user);
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

api.teamRemoveMember = function(req, res, next) {

  var team = req.team;
  var userId = req.params.userId;

  var failedToRemove = function() {
    res.status(400).json({
      message: 'Sorry, we couldn\'t remove that team member'
    });
  };

  UserModel.findOne({ _id: userId }, function(err, user) {
    if (err || !user) return handleError(res, 'Team member not found');

    team.removeAdmin(user);
    team.removeTeamMember(user);

    team.save(function(err) {
      if (err) return failedToRemove();

      res.json({
        message: 'Team member successfully removed!',
        usedId: user._id
      });
    });

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

api.locationGetCity = function(req, res, next) {

  if (!req.query.lat || !req.query.long)
    return res.status(400).json({
      message: 'lat and long params required'
    });

  getCityFromCoords(req.query.lat, req.query.long, function(err, city) {
    if (err) return handleError(res, 'Error finding your city');

    res.json({ city: city });
  });
};

api.locationGetTimezone = function(req, res, next) {

  if (!req.query.lat || !req.query.long)
    return res.status(400).json({
      message: 'lat and long params required'
    });

  getTimezoneFromLocation(req.query.lat, req.query.long, function(err, tz) {
    if (err) return handleError(res, 'Error finding your timezone');

    res.json({ tz: tz });
  });
};

api.getGravatar = function(req, res, next) {

  var email = req.query.email;

  if (!email)
    return res.status(400).json({
      message: 'email parameter required'
    });

  var emailHash = crypto.createHash('md5').update(email).digest('hex');

  res.json({
    avatar: 'http://www.gravatar.com/avatar/' + emailHash + '?s=200'
  });

};

// TEMP API AUTH methods
api.getOrCreateAPIClient = function(req, res, next) {

  APIClientModel.findOne({ user: req.user.id }, function(err, client) {
    if (err) return handleError(res, 'Error finding client');

    if (client) return res.json(client);

    var userClient = new APIClientModel({
      user: req.user
    });

    if (req.query.name) userClient.name = req.query.name;

    userClient.save(function(err) {
      if (err) return handleError(res, 'Failed to save: ' + err);
      res.json(userClient);
    });
  });

};

api.getOrCreateAPIClientToken = function(req, res, next) {

  APIClientModel.findOne({ _id: req.params.id }, function(err, client) {
    if (err) return handleError(res, 'Error finding client');

    APIAuthModel.findOne({
      user: req.user.id,
      client: req.params.id
    }, function(err, auth) {
      if (err) return handleError(res, 'Error finding client or user');

      if (auth) return res.json(auth);

      var userAuth = new APIAuthModel({
        user: req.user,
        client: client
      });

      userAuth.createToken();

      userAuth.save(function(err) {
        if (err) return handleError(res, 'Failed to save: ' + err);
        res.json(userAuth);
      });
    });

  });

};
