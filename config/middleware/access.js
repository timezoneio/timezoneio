var UserModel = require('../../app/models/user');
var TeamModel = require('../../app/models/team');

var access = module.exports = {};


access.allowImpersonate = function(req, res, next) {

  if (!req.user || !req.user.isSuperAdmin() || !req.query.impersonate)
    return next();

  UserModel
    .findOne({ _id: req.query.impersonate })
    .then(function(user) {
      if (!user) return next();

      res.locals.impersonateUser = user;
      next();
    }, function(err) {
      next();
    });
};

access.requireLoggedIn = function(req, res, next) {
  if (req.user)
    return next();

  res.redirect('/login');
};

access.requireSuperUser = function(req, res, next) {
  if (req.user && req.user.isSuperAdmin())
    return next();

  res.status(403).json({
    message: 'Ah ah ah, you didn\'t say the magic word',
    url: req.baseUrl
  });
};

// Ensure the requesting user is an admin of a team (team is appended to req.team)
//   teamId can be passed via query string or posted
//   id can be in url params
access.requireTeamAdmin = function(req, res, next) {

  // We check body when passed via POST params and not in URL
  var teamId = req.body.teamId || req.query.teamId || req.params.id;
  var isSuperAdmin = req.user && req.user.isSuperAdmin();

  TeamModel.findOne({ _id: teamId }, function(err, team) {
    if (err || !team)
      return res.status(403).json({
        message: 'I can\'t find a team with that id (' + teamId + ') man...'
      });

    if (!team.isAdmin(req.user) && !isSuperAdmin)
      return res.status(403).json({
        message: 'You\'re not an admin ;)'
      });

    // Append the team model
    req.team = team;

    next();
  });
};

// Attaches the the user id in the url params as req.activeUser
access.requireUser = function(req, res, next) {
  UserModel.findOne({ _id: req.params.id }, function(err, user) {
    if (err || !user)
      return res.status(403).json({
        message: 'I can\'t find a user with that id (' + req.params.id  + ') man...'
      });
    req.activeUser = user;
    next();
  });
};

// Ensures the requesting user can edit the user (req.activeUser)
access.requireEditPrivlidges = function(req, res, next) {

  var isOwner = req.activeUser._id.toString() === req.user._id.toString();

  if (isOwner) return next();

  // Re allowing a admin to edit a registered team member
  // Do not allow admin editing of registered users (for now)
  // if (req.activeUser.isRegistered)
  //   return res.status(403).json({
  //     message: 'Only this user can edit their own account info'
  //   });

  TeamModel
    .findAllByUserId(req.activeUser._id)
    .then(function(teams) {

      var isAdmin = teams.reduce(function(isAdmin, team) {
        return isAdmin || team.isAdmin(req.user);
      }, false);

      if (isAdmin)
        return next();

      res.status(403).json({
        message: 'You\'re not an admin ;)'
      });
    }, function(err) {
      res.status(403).json({
        message: 'We got team issues'
      });
    });

};
