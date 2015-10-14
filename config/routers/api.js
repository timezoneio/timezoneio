var express = require('express');
var api = require('../../app/controllers/api');
var access = require('../middleware/access');


var router = express.Router();

router.all(   '*', access.requireAuthentication);

router.get(   '/user', access.requireTeamAdmin,  api.getUserByEmail);
router.post(  '/user', access.requireTeamAdmin,  api.userCreate);
router.get(   '/user/:id', access.requireUser, api.userGet);
router.put(   '/user/:id', access.requireUser, access.requireEditPrivlidges, api.userUpdate);
router.put(   '/user/:id/setting', access.requireUser, access.requireEditPrivlidges, api.userUpdateSetting);
router.delete('/user/:id', access.requireSuperUser, api.userDelete);

router.get(   '/team/:id', api.team);
router.put(   '/team/:id', access.requireTeamAdmin, api.teamUpdate);
router.delete('/team/:id', access.requireTeamAdmin, api.teamDelete);
router.post(  '/team/:id/member', access.requireTeamAdmin, api.teamAddMember);
router.delete('/team/:id/member/:userId', access.requireTeamAdmin, api.teamRemoveMember);

router.get(   '/location/search', api.locationSearch);
router.get(   '/location/city', api.locationGetCity);
router.get(   '/location/timezone', api.locationGetTimezone);

router.get(   '/avatar/gravatar', api.getGravatar);

// These should be POSTs + GETs
router.get(   '/client', api.getOrCreateAPIClient);
router.get(   '/client/:id/token', api.getOrCreateAPIClientToken);

// 404
router.use(function(req, res, next) {
  res.status(404).json({ message: 'Endpoint not found' });
});


module.exports = router;
