var TeamModel = require('../models/team.js');
var UserModel = require('../models/user.js');

var admin = module.exports = {};


admin.index = function(req, res, next) {

  if (!req.user || !req.user.isSuperAdmin())
    return next();

  Promise.all([
    TeamModel
      .find()
      .limit(50)
      .populate('admins'),
    UserModel.count()
  ]).then(function(values) {
    var teams = values[0];
    var numUsers = values[1];

    res.render('admin', {
      title: 'Admin',
      numUsers: numUsers,
      teams: teams
    });

  });

};
