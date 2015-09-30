var apiRouter = require('./routers/api');
var access = require('./middleware/access')
var base = require('../app/controllers/base');
var auth = require('../app/controllers/auth');
var team = require('../app/controllers/team');
var people = require('../app/controllers/people');
var services = require('../app/controllers/services');
var admin = require('../app/controllers/admin');
var getProfileUrl = require('../app/helpers/urls').getProfileUrl;

var oauthConnectFlast = function(req, res, next) {
  if (req.query.use_avatar)
    req.flash('use_avatar', true);
  next();
};


module.exports = function(app, passport) {


  app.get('/', base.index);
  app.get('/about', base.about);
  app.get('/roadmap', base.roadmap);

  app.get('/login', auth.login);
  app.post('/login', passport.authenticate('local', {
                        failureRedirect: '/login',
                        failureFlash: 'Invalid email or password'
                      }),
                      function(req, res) {
                        var next = req.flash('next');
                        next = (next && next[0]) || getProfileUrl(req.user);
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

  app.get('/get-started', people.getStarted);
  app.get('/people/:usernameOrId', people.index);
  app.post('/people/:usernameOrId', people.save);
  app.get('/my-profile', people.myProfile);

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


  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
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
    // res.status(500).render('500', { error: err.stack });
    res.status(500).send({ error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).send('404 Not found!');
  });

};
