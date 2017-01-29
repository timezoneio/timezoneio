var TeamModel = require('../models/team.js');
var UserModel = require('../models/user.js');
var Client = require('../models/apiClient.js');
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

var toSuperAdminJSON = function(model) {
  return typeof model.toSuperAdminJSON !== 'undefined' ?
         model.toSuperAdminJSON() :
         model.toJSON();
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
      teams: teams ? teams.map(toSuperAdminJSON) : [],
      users: users ? users.map(toSuperAdminJSON) : []
    });

  });

};

admin.users = function(req, res) {

  const COUNT = 50;
  var page = parseInt(req.query.p || 1, 10);
  var query = {};
  var search = req.query.search;

  if (search) {
    search = search.trim();
    if (isValidEmail(search))
      query.email = search;
    else if (search.length === 24)
      query._id = search;
    else
      query.name = new RegExp(search, 'i');
  }

  UserModel
    .find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * COUNT)
    .limit(COUNT)
    .then(function(users) {
      res.render('admin', {
        title: 'Admin',
        users: users ? users.map(toSuperAdminJSON) : [],
        baseUrl: '/admin/users',
        prevPage: page > 1 ? (page - 1) : null,
        nextPage: users && users.length === COUNT ? (page + 1) : null
      });
    }, handleError(res));
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
        .then(function(teams) {
          res.render('admin', {
            title: 'Admin',
            manageUser: toSuperAdminJSON(user),
            teams: teams
          });
        });

    }, handleError(res));
};

admin.userUpdate = function(req, res) {
  UserModel
    .findOne({ _id: req.params.userId })
    .then(function(user) {

      if (!user)
        return res.render('admin', {
          title: 'Admin',
          message: 'Could not find user'
        });

      for (var key in req.body) {
        if (UserModel.ADMIN_WRITABLE_FIELDS.indexOf(key) > -1) {
          user[key] = req.body[key];
        }
      }

      // :(
      if ('password' in req.body) {
        user.password = req.body.password;
      }

      user.save(function(err) {
        if (err) return handleError(res, 'Failed to save');
        res.redirect(req.url);
      });

    }, handleError(res));
};

admin.teams = function(req, res) {
  const COUNT = 50;
  var page = parseInt(req.query.p || 1, 10);
  var search = req.query.search;
  var query = {};

  if (search) {
    query.name = new RegExp(search.trim(), 'i');
  }

  TeamModel
    .find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * COUNT)
    .limit(COUNT)
    .then(function(teams) {
      res.render('admin', {
        title: 'Admin',
        teams: teams ? teams.map(toSuperAdminJSON) : [],
        baseUrl: '/admin/teams',
        prevPage: page > 1 ? (page - 1) : null,
        nextPage: teams && teams.length === COUNT ? (page + 1) : null
      });
    }, handleError(res));
};

admin.clients = function(req, res) {
  Client
    .find()
    .limit(50)
    .then(function(clients) {
      res.render('admin', {
        title: 'Admin - Clients',
        clients: clients,
        baseUrl: '/admin/clients',
      });
    })
    .catch(handleError(res));
};

admin.clientCreate = function(req, res) {
  if (!req.body.name) {
    return handleError(res)('Must provide name');
  }

  const client = new Client({
    name: req.body.name,
    user: req.user,
  });
  client.generateSecret();
  client.save(function(err) {
    if (err) return handleError(res)('Failed to save');
    res.redirect(`/admin/client/${client._id}`);
  });
};

admin.client = function(req, res) {
  Client
    .findOne({ _id: req.params.clientId })
    .populate('user')
    .then(function(client) {
      res.render('admin', {
        title: 'Admin - Client',
        client: client,
      });
    })
    .catch(handleError(res));
};
