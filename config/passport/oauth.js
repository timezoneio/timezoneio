const BearerStrategy = require('passport-http-bearer').Strategy
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
const Client = require('../../app/models/client')
const AccessToken = require('../../app/models/accessToken')

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an
 * access token (aka a bearer token).
 */
module.exports.bearer = new BearerStrategy(
  function (accessToken, done) {
    AccessToken
      .findOne({ token: accessToken })
      .populate('user')
      .then(function(token) {
        if (!token || !token.user) return done(null, false)
        done(null, token.user, { scope: '*' })
      })
      .catch(done)
  }
)

/**
 * ClientPasswordStrategy
 *
 * This strategy is used during the OAuth2 flow when a client is using
 * an authorization code to get an access token
 */
module.exports.clientPassword = new ClientPasswordStrategy(
  function(clientId, clientSecret, done) {
    Client.findOne({ _id: clientId })
      .then(function (c) {
        if (!c) return done(null, false)
        if (c.secret !== clientSecret) return done(null, false)
        done(null, c)
      })
      .catch(done)
  }
)
