
// Used to invite all the buffer team onto the platform!!

var async = require('async');
var connect = require('./migrationConnect');
var UserModel = require('../app/models/user');
var TeamModel = require('../app/models/team');
var sendEmail = require('../app/email/send');

const TEAM_ID = '5513953c6d1aacc66f7e7efe'; // buffer

connect(function(err, connection) {

  // Buffer
  TeamModel.findOne({ _id: TEAM_ID })
    .populate('people')
    .populate('admins')
    .then(function(team) {

      var admin = team.admins[0];

      async.eachSeries(team.people, function(user, done) {

        if (user.isRegistered)
          return done();

        console.log('Inviting %s', user.name);

        sendEmail('invite', user.email, {
          inviteUrl: team.getInviteUrl(user),
          adminName: admin.name,
          teamName: team.name
        }).then(done, done);

      }, function() {
        connection.close();
      });

    });

});
