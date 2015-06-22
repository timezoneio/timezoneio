var crypto = require('crypto');
var moment = require('moment-timezone');

var UserModel = require('../models/user.js');
var TeamModel = require('../models/team.js');
var LocationModel = require('../models/location.js');

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
    newUser.addToTeam(req.team);

    newUser.save(function(err) {
      if (err) return handleError(res, 'Failed to save: ' + err);
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
      if (UserModel.ADMIN_WRITABLE_FIELDS.indexOf(key) > -1) {
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

    if (!user.removeFromTeam(team))
      return failedToRemove();

    user.save(function(err) {
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
