var async = require('async');
var _ = require('underscore');
var connect = require('./migrationConnect');
var UserModel = require('../app/models/user.js');
var TeamModel = require('../app/models/team.js');
var TeamMemberModel = require('../app/models/teamMember.js');

// Migrates schema from having user refs in teams to new collection

connect(function(err, connection) {

  var found = 0;
  var total = 0;

  TeamModel
    .find()
    .then(function(teams) {

      async.eachSeries(teams, function(team, teamDone) {
        async.eachSeries(team.people, function(userId, userDone) {

          found++;
          // return userDone();

          var teamMember = new TeamMemberModel({
            user: userId,
            team: team._id
          });
          teamMember.save(function(err) {
            if (!err) total++;
            userDone();
          });

        }, function() {
          // TODO - Unset people array from team
          teamDone();
        });
      }, function() {
        console.log('migrated ' + total + ' out of ' + found);
        connection.close();
      });

    });

});
