var UserModel = require('../app/models/user');
var local = require('./passport/local');
var twitter = require('./passport/twitter');

module.exports = function (passport) {

  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    UserModel.findOne({ _id: id }, done);
  });

  passport.use(local);
  passport.use(twitter);
  // passport.use(google);
  // passport.use(facebook);

};
