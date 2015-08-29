var async = require('async');
var _ = require('underscore');
var connect = require('./migrationConnect');
var UserModel = require('../app/models/user.js');
var TeamModel = require('../app/models/team.js');

// Migrates schema from having team refs in users to user refs in teams

connect(function(err, connection) {

  // Cleanup duplicates
  // TeamModel
  //   .find()
  //   .then(function(teams) {
  //
  //     async.eachSeries(teams, function(team, teamDone) {
  //       team.people = _.chain(team.people)
  //         .map(function(id) { return id.toString(); })
  //         .uniq()
  //         .value();
  //       team.save(teamDone);
  //     }, function done() {
  //       connection.close();
  //     });
  //
  //   });

  UserModel
    .find()
    .populate('teams')
    .then(function(users) {
      console.log('found %d users', users.length);

      async.eachSeries(users, function(user, usersDone) {
        console.log('Updating ' + user.name);

        async.eachSeries(user.teams, function(team, teamsDone) {

          // Add the user to the team;
          team.addTeamMember(user);
          team.save(teamsDone);

        }, function () {
          user.teams = [];
          user.save(usersDone);
        });

      }, function done() {
        connection.close();
      });
    });
});
