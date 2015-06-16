var express = require('express');
var TeamModel = require('../../app/models/team.js');
var api = require('../../app/controllers/api.js');



var apiRequireAuthentication = function(req, res, next) {
  if (req.user) return next();

  res.status(403).json({
    message: 'Ah ah ah, you didn\'t say the magic word'
  });
};

var apiRequireTeamAdmin = function(req, res, next) {

  var teamId = req.body.teamId || req.params.id;

  TeamModel.findOne({ _id: teamId }, function(err, team) {
    if (err)
      return res.status(403).json({
        message: 'I can\'t find a team with that id man...'
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


var router = express.Router();

router.all('*', apiRequireAuthentication);

router.post('/user', apiRequireTeamAdmin,  api.userCreate);
router.put('/user/:id', apiRequireTeamAdmin, api.userUpdate);
router.put('/team/:id', apiRequireTeamAdmin, api.teamUpdate);
router.get('/location/search', api.locationSearch);


module.exports = router;
