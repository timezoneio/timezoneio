const BearerStrategy = require('passport-http-bearer').Strategy;
const Token = require('../../app/models/apiAuth'); //apiToken

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an
 * access token (aka a bearer token).
 */
module.exports.bearer = new BearerStrategy(
  function (accessToken, done) {
    Token
      .findOne({ token: accessToken })
      .populate('user')
      .then(function(token) {
        if (!token || !token.user) return done(null, false);
        done(null, token.user, { scope: '*' });
      })
      .catch(done);
  }
);
