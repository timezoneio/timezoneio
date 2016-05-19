var apiRouter = require('./routers/api');
var access = require('./middleware/access');
var main = require('../app/controllers/main');
var auth = require('../app/controllers/auth');
var account = require('../app/controllers/account');
var team = require('../app/controllers/team');
var people = require('../app/controllers/people');
var services = require('../app/controllers/services');
var admin = require('../app/controllers/admin');

var oauthConnectFlast = function(req, res, next) {
  if (req.query.use_avatar)
    req.flash('use_avatar', true);
  next();
};


module.exports = function(app, passport) {

  app.use('*', access.allowImpersonate);

  app.get('/', main.index);
  app.get('/about', main.about);
  app.get('/roadmap', main.roadmap);
  app.get('/contact', main.contact);

  app.get('/login', auth.login);
  app.post('/login', passport.authenticate('local', {
                        failureRedirect: '/login',
                        failureFlash: 'Invalid email or password'
                      }),
                      function(req, res) {
                        var next = req.flash('next');
                        next = (next && next[0]) || req.user.getDefaultPageUrl();
                        res.redirect(next);
                      });
  app.get('/signup', auth.signup);
  app.post('/signup', auth.create);
  app.get('/join/:inviteHash', auth.joinTeam);
  app.get('/join/:inviteHash/:userId-:emailHash', auth.joinTeam);
  app.get('/logout', auth.logout);

  app.get('/connect/twitter', oauthConnectFlast,
                              passport.authorize('twitter', {
                                scope: 'email',
                                failureRedirect: '/my-profile'
                              }));
  app.get('/connect/twitter/callback', passport.authorize('twitter', {
                                        scope: 'email',
                                        failureRedirect: '/my-profile',
                                        failureFlash: true
                                        }),
                                       auth.connectTwitter);

  app.get('/account', access.requireLoggedIn, account.index);
  app.post('/account', access.requireLoggedIn, account.saveAccountInfo);
  app.get('/account/password', auth.passwordChangeForm);
  app.post('/account/password', auth.passwordChange);
  app.get('/account/request-password-reset', auth.passwordResetRequestForm);
  app.post('/account/request-password-reset', auth.passwordResetRequest);
  app.get('/account/password-reset', auth.verifyPasswordResetToken, auth.passwordResetForm);
  app.post('/account/password-reset', auth.verifyPasswordResetToken, auth.passwordReset);

  // app.get('/account/password', access.requireLoggedIn, account.password);

  app.get('/get-started', people.getStarted);
  app.get('/people/:usernameOrId', people.index);
  app.post('/people/:usernameOrId', people.save);
  app.get('/my-profile', people.myProfile);

  app.get('/home', access.requireLoggedIn, main.home);

  app.get('/team', team.createForm);
  app.post('/team', team.create);
  app.get('/team/:name', team.index);
  app.get('/team/:name/:view', team.index);

  app.use('/api', apiRouter);

  app.use('/sign-s3', services.signS3);

  app.use('/admin', access.requireSuperUser);
  app.get('/admin', admin.index);
  app.get('/admin/users', admin.users);
  app.get('/admin/user/:userId', admin.user);
  app.post('/admin/user/:userId', admin.userUpdate);
  app.get('/admin/teams', admin.teams);

  var emojiStringToArray = function (str) {
    var split = str.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
    var arr = [];
    for (var i=0; i<split.length; i++) {
      var char = split[i];
      if (char !== "") {
        arr.push(char);
      }
    }
    return arr;
  };

  var emojiUrls = {
    '🐶': '/people/56435e1f41596305083170a2' // marc anythony
  };

  // special \xF0\x9F\x90\xB6
  app.get('/:emoji', function(req, res, next) {
    var emojis = emojiStringToArray(req.params.emoji);
    if (!emojis.length)
      return next();

    if (emojis[0] in emojiUrls)
      return res.redirect(emojiUrls[emojis[0]]);

    next();
  });

  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {

    console.info(req.url);

    // treat as 404
    if (err.message &&
        (~err.message.indexOf('not found') ||
         (~err.message.indexOf('Cast to ObjectId failed'))
        )
        ) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('Error', {
      type: 500,
      error: err.stack //.split('\n')
    });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('Error', {
      type: 404,
      error: 'Page not found!'
    });
  });

};
