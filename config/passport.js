var UserModel = require('../app/models/user');
var TeamModel = require('../app/models/team');
var local = require('./passport/local');
var twitter = require('./passport/twitter');

module.exports = function (passport) {

  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {

    // This is where we should cache the user
    // and cache the teams the user is on

    // Check if in cache

    // Query
    Promise.all([
      UserModel.findOne({ _id: id }),
      TeamModel.findAllByUserId(id)
               .limit(10)
               .select({ name: 1, slug: 1 })
    ]).then(function(values) {
      var user = values[0];
      user.teams = values[1];
      done(null, user);
    });
  });

  passport.use(local);
  passport.use(twitter);
  // passport.use(google);
  // passport.use(facebook);

};
