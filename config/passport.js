var UserModel = require('../app/models/user.js');
var local = require('./passport/local.js');


module.exports = function (passport) {
  
  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    UserModel.findOne({ _id: id }, done);
  });

  passport.use(local);
  // passport.use(google);
  // passport.use(facebook);
  // passport.use(twitter);

};