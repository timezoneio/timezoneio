var TeamModel = require('../models/team.js');
var UserModel = require('../models/user.js');
var isValidEmail = require('../utils/strings').isValidEmail;

var admin = module.exports = {};


var handleError = function(res) {
  return function(err) {
    res.status(500).render('admin', {
      title: 'Admin',
      message: err.message || '500 error unknown',
      error: err
    });
  };
};

admin.index = function(req, res, next) {

  // NOTE - We may want to cache some of these values
  Promise.all([
    TeamModel
      .find()
      .limit(50)
      .populate('admins'),
    UserModel.count(),
    UserModel.findAllRegistered().count()
  ]).then(function(values) {
    var teams = values[0];
    var numUsers = values[1];
    var numRegisteredUsers = values[2];

    res.render('admin', {
      title: 'Admin',
      numUsers: numUsers,
      numRegisteredUsers: numRegisteredUsers,
      teams: teams
    });

  });

};

admin.users = function(req, res) {

  var query = {};
  var search = req.query.search;

  if (search) {
    if (isValidEmail(search))
      query.email = search;
    else if (search.length === 24)
      query._id = search;
    else
      query.name = new RegExp(search, 'i');
  }

  UserModel
    .find(query)
    .then(function(users) {
      res.render('admin', {
        title: 'Admin',
        users: users || []
      });
    })
    .catch(handleError(res));
};

admin.user = function(req, res) {
  UserModel
    .findOne({ _id: req.params.userId })
    .then(function(user) {

      if (!user)
        return res.render('admin', {
          title: 'Admin',
          message: 'Could not find user'
        });

      TeamModel
        .findAllByUser(user)
        .limit(50)
        .then(function(teams) {
          res.render('admin', {
            title: 'Admin',
            manageUser: user.toOwnerJSON(),
            teams: teams
          });
        });

    })
    .catch(handleError(res));
};
