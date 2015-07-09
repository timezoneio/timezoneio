var express = require('express');
var UserModel = require('../../app/models/user.js');
var TeamModel = require('../../app/models/team.js');
var api = require('../../app/controllers/api.js');



var requireAuthentication = function(req, res, next) {
  if (req.user) return next();

  res.status(403).json({
    message: 'Ah ah ah, you didn\'t say the magic word'
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
router.put(   '/user/:id', requireTeamAdmin, requireUser, api.userUpdate);

router.put(   '/team/:id', requireTeamAdmin, api.teamUpdate);
// router.post(  '/team/:id/member', requireTeamAdmin, api.teamAddMember);
router.delete('/team/:id/member/:userId', requireTeamAdmin, api.teamRemoveMember);

router.get(   '/location/search', api.locationSearch);

router.get(   '/avatar/gravatar', api.getGravatar);


module.exports = router;
