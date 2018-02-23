const express = require('express')
const oauth2orize = require('oauth2orize')
const passport = require('passport')
const access = require('../middleware/access');
const User = require('../../app/models/user')
const Client = require('../../app/models/apiClient')
const AuthorizationCode = require('../../app/models/authorizationCode')
const AccessToken = require('../../app/models/accessToken')

const server = oauth2orize.createServer()

server.grant(oauth2orize.grant.code(function (client, redirectURI, user, ares, done) {
  const ac = new AuthorizationCode({
    user: user,
    client: client,
    redirectURI: redirectURI,
  })
  ac.save(function (err) {
    if (err) return done(err)
    done(null, ac.code)
  })
}))

server.exchange(oauth2orize.exchange.code(function (client, code, redirectURI, done) {
  AuthorizationCode
    .findOne({ code: code })
    .then(function (ac) {
      if (!ac) return done('Authorization code not found')
      if (client._id.toString() !== ac.client.toString()) return done(null, false)
      if (redirectURI !== ac.redirectURI) return done(null, false)

      const at = new AccessToken({
        user: ac.user,
        client: client,
      })
      at.createToken()
      at.save(function (err) {
        if (err) return done(err)
        return done(null, at.token)
      })
    })
    .catch(done)
}))

server.serializeClient(function(client, done) {
  return done(null, client._id)
})

server.deserializeClient(function(id, done) {
  Client.findOne({ _id: id }, function(err, c) {
    if (err) return done(err)
    return done(null, c)
  })
})

// ----- Router -----
const router = express.Router()

router.get('/authorize',
  access.requireLoggedIn,
  server.authorize(function(clientId, redirectURI, done) {
    Client
      .findOne({ _id: clientId })
      .then(function (c) {
        if (!c) return done(null, false)
        if (redirectURI !== c.redirectURI) return done(null, false)
        done(null, c, c.redirectURI)
      })
      .catch(done)
  }),
  function (req, res) {
    res.render('oauthDialog', {
      transactionID: req.oauth2.transactionID,
      user: req.user,
      client: req.oauth2.client,
    })
  }
)

router.post('/authorize/decision',
   access.requireLoggedIn,
   // TODO - Add cancel field in form
   // https://github.com/jaredhanson/oauth2orize/blob/f4b51eeaa604fedab70cfa81170216c196636d67/lib/middleware/decision.js#L79
   server.decision()
)

router.post('/token',
  access.requireLoggedIn,
  // May need to add "basic" or bearer strategy here
  passport.authenticate(['oauth2-client-password'], { session: false }),
  server.token(),
  server.errorHandler()
)

module.exports = router
