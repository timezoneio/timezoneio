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

var toAdminJSON = function(model) {
  return typeof model.toAdminJSON !== 'undefined' ? model.toAdminJSON() : model.toJSON();
};

admin.index = function(req, res, next) {

  // NOTE - We may want to cache some of these values
  Promise.all([
    UserModel.count(),
    UserModel.findAllRegistered().count(),
    TeamModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('admins'),
    UserModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
  ]).then(function(values) {

    var numUsers = values[0];
    var numRegisteredUsers = values[1];
    var teams = values[2];
    var users = values[3];

    res.render('admin', {
      title: 'Admin',
      numUsers: numUsers,
      numRegisteredUsers: numRegisteredUsers,
      teams: teams ? teams.map(toAdminJSON) : [],
      users: users ? users.map(toAdminJSON) : []
    });

  });

};

admin.users = function(req, res) {

  const COUNT = 50;
  var page = parseInt(req.query.p || 1, 10);
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
    .skip((page - 1) * COUNT)
    .limit(COUNT)
    .then(function(users) {
      res.render('admin', {
        title: 'Admin',
        users: users ? users.map(toAdminJSON) : [],
        baseUrl: '/admin/users',
        prevPage: page > 1 ? (page - 1) : null,
        nextPage: users && users.length === COUNT ? (page + 1) : null
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

admin.teams = function(req, res) {
  const COUNT = 50;
  var page = parseInt(req.query.p || 1, 10);

  TeamModel
    .find()
    .skip((page - 1) * COUNT)
    .limit(COUNT)
    .then(function(teams) {
      res.render('admin', {
        title: 'Admin',
        teams: teams ? teams.map(toAdminJSON) : [],
        baseUrl: '/admin/teams',
        prevPage: page > 1 ? (page - 1) : null,
        nextPage: teams && teams.length === COUNT ? (page + 1) : null
      });
    })
    .catch(handleError(res));
};
