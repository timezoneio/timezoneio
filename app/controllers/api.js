var crypto = require('crypto');
var async = require('async');
const ENV = require('../../env.js');
var getTimezoneFromLocation = require('../helpers/getTimezoneFromLocation');
var getCityFromCoords = require('../helpers/getCityFromCoords');
var twitterHelper = require('../helpers/twitter');

var UserModel = require('../models/user');
var TeamModel = require('../models/team');
var LocationModel = require('../models/location');
var APIClientModel = require('../../app/models/apiClient');
var APIAuthModel = require('../../app/models/apiAuth');
var sendEmail = require('../../app/email/send');
var errorCodes = require('../helpers/errorCodes');

var api = module.exports = {};

var TEAM_WRITABLE_FIELDS = ['name'];

var createErrorHandler = function(res) {
  return function(err) {
    handleError(res, 500, err.message);
  };
};

// statusCode is optional, defaulted to 400
var handleError = function(res, statusCode, message, errorCode) {
  if (!errorCode && typeof message === 'number') {
    errorCode = message;
    message = null;
  }
  if (!message && typeof statusCode === 'string') {
    message = statusCode;
    statusCode = 400;
  }

  var errorResponse = {
    message: message || 'Something bad happened'
  };

  if (errorCode)
    errorResponse.code = errorCode;

  res
    .status(statusCode)
    .json(errorResponse);
};

api.userGetSelf = function(req, res) {
  if (!req.user) {
    res.status(400).json({
      message: 'Not logged in',
      url: 'https://timezone.io/login'
    })
  } else {
    res.json(req.user.toOwnerJSON())
  }
};

api.getUserByEmail = function(req, res, next) {

  if (!req.query.email)
    return res.status(400).json({ message: 'Please provide email parameter' });

  const email = req.query.email.toLowerCase();

  UserModel.findOneByEmail(email)
    .then(function(user) {
      if (user)
        return res.json(user);

      var emailHash = crypto.createHash('md5').update(email).digest('hex');
      res.json({
        hash: emailHash,
        message: 'No user with that email!'
      });
    }, function(err) {
      handleError(res, err);
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

  UserModel.findOneByEmail(userData.email, function(err, user) {

    // NOTE - in the future we should do a search before creating user
    if (user) return handleError(res, 'That user already exists!');

    userData.email = userData.email.toLowerCase();

    var validData = {};
    for (var key in userData) {
      if (UserModel.ADMIN_WRITABLE_FIELDS.indexOf(key) > -1) {
        validData[key] = userData[key];
      }
    }

    var newUser = new UserModel(validData);

    // Add user to team
    req.team
      .addTeamMember(newUser)
      .then(function(user) {
        newUser.save(function(err) {
          if (err) return handleError(res, 'Failed to save: ' + err);

          sendEmail('invite', newUser.email, {
            inviteUrl: req.team.getInviteUrl(newUser),
            adminName: req.user.name,
            name: newUser.name || 'there', // Hi <there>!,
            teamName: req.team.name
          });

          res.json(newUser);
        });
      }, function(err) {
        return handleError(res, 'Failed to save: ' + err);
      });

  });

};

api.userGet = function(req, res, next) {
  res.carset = 'utf-8';
  var isOwner = req.activeUser._id.toString() === req.user._id.toString();
  res.json(isOwner ? req.activeUser.toOwnerJSON() : req.activeUser.toJSON());
};

api.userUpdate = function(req, res, next) {

  var user = req.activeUser;
  var isOwner = user._id.toString() === req.user._id.toString();

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
    res.json(isOwner ? user.toOwnerJSON() : user);
  });

};

api.userUpdateSetting = function(req, res) {
  var user = req.activeUser;

  user.setUserSetting(req.body.name, req.body.value);
  user.save(function(err) {
    if (err) return handleError(res, 'Failed to save');
    res.json({
      setting: user.getUserSettingDoc(req.body.name),
      message: 'Setting successfully saved!'
    });
  });
};

api.userDelete = function(req, res) {

  UserModel
    .findOne({ _id: req.params.id })
    .then(function(user) {

      if (!user)
        return res.status(400).json({ message: 'User not found' });
      if (user.isSuperAdmin())
        return res.status(403).json({ message: 'FORBIDDEN! Cannot delete that user' });

      TeamModel
        .findAllByUser(user)
        .then(function(teams) {

          async.eachSeries(teams, function(team, done) {
            team.removeAdmin(user);
            team.removeTeamMember(user);
            team.save(function(err) {
              done(err);
            });
          }, function(results) {
            UserModel
              .remove({ _id: user._id })
              .then(function() {
                res.json({ message: 'User was deleted', results: results });
              }, createErrorHandler(res));
          });
        }, createErrorHandler(res));
    }, createErrorHandler(res));
};

api.userFixBrokenImage = function(req, res) {
  UserModel
    .findOneById(req.params.id)
    .then(function(user) {
      if (!user.twitter || !user.isUsingTwitterAvatar()) {
        return res.status(400).json({ message: 'User does not use their twitter avatar' });
      }

      return twitterHelper.getTwitterAvatar(user.twitter)
        .then(function(avatar) {
          user.twitter.profile_image_url_https = avatar;
          user.useAvatar('twitter');
          return user.save()
            .then(function() {
              res.json(user);
            });
        });
    })
    .catch(createErrorHandler(res));
};

api.team = function(req, res) {

  // NOTE - no security on this yet
  TeamModel
    .findOneWithTeamMembers({ _id: req.params.id })
    // .populate('admins')
    .then(function(team) {
      if (!team)
        return res.status(400).json({
          message: 'I can\'t find a team with that id (' + req.params.id + ') man...'
        });
      var json = team.toJSON();
      json.people = team.people.map((p) => p.toJSON());
      res.json(json);
    }, function(err) {
      res.status(400).json({ message: err });
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

  team.save(function(err, savedTeam) {
    if (err) return handleError(res, 'Failed to save');
    res.json(savedTeam);
  });
};

api.teamDelete = function(req, res) {

  TeamModel
    .removeById(req.params.id)
    .then(function() {
      res.json({ message: 'Team was successfully deleted' });
    }, createErrorHandler());
};

api.teamAddMember = function(req, res, next) {
  var team = req.team;
  var userId = req.body.userId;

  var failedToAdd = function(message) {
    res.status(400).json({
      message: message || 'Sorry, we couldn\'t add that team member'
    });
  };

  if (!userId)
    return failedToAdd('Please provide a userId in the body of your request');

  UserModel.findOne({ _id: userId })
    .then(function(user) {
      if (!user)
        return failedToAdd('Sorry, we couldn\'t find that team member');

      team
        .addTeamMember(user)
        .then(function(teamMember) {
          res.json({
            user: user.toAdminJSON(),
            message: 'Team member successfully added!'
          });
        }, function() {
          failedToAdd();
        });

    }, function(err) {
      failedToAdd();
    });
};

api.teamRemoveMember = function(req, res, next) {

  var team = req.team;
  var userId = req.params.userId;

  if (req.user._id.toString() === userId)
    return handleError(res, 'You cannot remove yourself from the team');

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
      // code: errorCodes.PARAM_MISSING,
      message: 'lat and long params required'
    });

  getCityFromCoords(req.query.lat, req.query.long, function(err, city) {
    if (err) return handleError(res, 'Error finding your city', errorCodes.CITY_NOT_FOUND);

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
    avatar: 'https://www.gravatar.com/avatar/' + emailHash + '?s=200'
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

api.getOrCreateAPIClientToken = function(req, res) {
  var secret = req.query.secret;

  if (!secret) return handleError(res, 'Client secret required');

  APIClientModel.findOne({ _id: req.params.id }, function(err, client) {
    if (err) return handleError(res, 'Error finding client');

    if (client.secret !== secret) return handleError(res, 'Incorrect client secret')

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
