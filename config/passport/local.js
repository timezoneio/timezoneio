// var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var UserModel = require('../../app/models/user');
var TeamModel = require('../../app/models/team');


module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {

    UserModel.findOneByEmail(email, function(err, user) {
      if (err) return done(err);

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' });
      }

      // We query this to get the user's first url they see post-Login
      TeamModel
        .findAllByUserId(user._id)
        .sort({ createdAt: 1 }) // oldest first
        .limit(1)
        .then(function(teams) {
          user.teams = teams;
          done(null, user);
        })
        .catch(function(err) {
          done(null, user);
        });
    });

  }
);
