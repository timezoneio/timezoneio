var TeamModel = require('../models/team.js');
var UserModel = require('../models/user.js');
var isValidEmail = require('../utils/strings').isValidEmail;

var admin = module.exports = {};


admin.index = function(req, res, next) {

  if (!req.user || !req.user.isSuperAdmin())
    return next();

  var search = req.query.search;

  if (search) {
    var query = {};
    if (isValidEmail(search))
      query.email = search;
    else if (search.length === 24)
      query._id = search;
    else
      query.name = new RegExp(search, 'i');

    UserModel.find(query)
      .then(function(users) {

        // TeamModel
        //   .find({ people: { $in: users.map(function(u) { return u._id }) } })
        //   .limit(50)
        //   .then(function(teams) {
        //
        //   });

        res.render('admin', {
          title: 'Admin',
          users: users || []
        });
      })
      .catch(function(err) {
        res.render('admin', {
          title: 'Admin',
          users: []
        });
      });

    return;
  }

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
