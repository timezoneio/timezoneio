var express = require('express');
var UserModel = require('../../app/models/user.js');
var TeamModel = require('../../app/models/team.js');
var APIClientModel = require('../../app/models/apiClient.js');
var APIAuthModel = require('../../app/models/apiAuth.js');
var api = require('../../app/controllers/api.js');



var requireAuthentication = function(req, res, next) {
  if (req.user) return next();

  var accessToken = req.query.access_token || req.body.access_token || null;

  if (accessToken) {
    APIAuthModel.findOne({ token: accessToken }, function(err, auth) {
      if (err || !auth)
        return res.status(403).json({
          message: 'Invalid token :('
        });

      UserModel.findOne({ _id: auth.user }, function(err, user) {
        if (err || !user)
          return res.status(403).json({
            message: 'No user found!'
          });

        req.user = user;

        next();
      });
    });
    return;
  }

  res.status(403).json({
    message: 'Ah ah ah, you didn\'t say the magic word',
    url:req.baseUrl
  });
};

var requireTeamAdmin = function(req, res, next) {

  // We check body when passed via POST params and not in URL
  var teamId = req.body.teamId || req.params.id;

  TeamModel.findOne({ _id: teamId }, function(err, team) {
    if (err || !team)
      return res.status(403).json({
        message: 'I can\'t find a team with that id (' + teamId + ') man...'
      });

    if (!team.isAdmin(req.user))
      return res.status(403).json({
        message: 'You\'re not an admin ;)'
      });

    // Append the team model
    req.team = team;

    next();
  });
};

var requireEditPrivlidges = function(req, res, next) {

  if (req.activeUser._id === req.user._id) return next();

  // TODO CHANGE TO SINGLE QUERY WITH MULTIPLE IDS
  var findTeam = function(teams, idx) {
    TeamModel.findOne({ _id: teams[idx] }, function(err, team) {
      if (err)
        return res.status(403).json({
          message: 'We got team issues'
        });

      if (team.isAdmin(req.user)) return next();

      if (idx + 1 < teams.length) return findTeam(teams, ++idx);

      res.status(403).json({
        message: 'You\'re not an admin ;)'
      });
    });
  };

  findTeam(req.activeUser.teams, 0);

};

var requireUser = function(req, res, next) {
  UserModel.findOne({ _id: req.params.id }, function(err, user) {
    if (err || !user)
      return res.status(403).json({
        message: 'I can\'t find a user with that id (' + req.params.id  + ') man...'
      });
    req.activeUser = user;
    next();
  });
};


var router = express.Router();

router.all(   '*', requireAuthentication);

router.post(  '/user', requireTeamAdmin,  api.userCreate);
router.get(   '/user/:id', requireUser, api.userGet);
router.put(   '/user/:id', requireUser, requireEditPrivlidges, api.userUpdate);

router.put(   '/team/:id', requireTeamAdmin, api.teamUpdate);
// router.post(  '/team/:id/member', requireTeamAdmin, api.teamAddMember);
router.delete('/team/:id/member/:userId', requireTeamAdmin, api.teamRemoveMember);

router.get(   '/location/search', api.locationSearch);

router.get(   '/avatar/gravatar', api.getGravatar);

// These should be POSTs + GETs
router.get(   '/client', api.getOrCreateAPIClient);
router.get(   '/client/:id/token', api.getOrCreateAPIClientToken);


module.exports = router;
