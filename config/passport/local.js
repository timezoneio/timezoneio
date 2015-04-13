// var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var UserModel = require('../../app/models/user.js');


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
      return done(null, user);
      
    });

  }
);