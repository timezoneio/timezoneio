
var base = require('../app/controllers/base.js');
var auth = require('../app/controllers/auth.js');
var team = require('../app/controllers/team.js');
var api = require('../app/controllers/api.js');
var people = require('../app/controllers/people.js');


module.exports = function(app, passport) {


  app.get('/', base.index);

  app.get('/login', auth.login);
  app.post('/login', passport.authenticate('local', {
                        failureRedirect: '/login',
                        failureFlash: 'Invalid email or password'
                      }),
                      function(req, res) {
                        res.redirect('/people/' + req.user.username);
                      });
  app.get('/logout', auth.logout);

  app.get('/team/:name', team.index);
  app.get('/team/:name/:view', team.index);

  app.get('/people/:username', people.index);

  app.post('/api/user', api.userCreate);
  app.put('/api/user/:id', api.userUpdate);
  app.put('/api/team/:id', api.teamUpdate);
  app.get('/api/location/search', api.locationSearch);



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
    // res.status(404).render('404', {
    //   url: req.originalUrl,
    //   error: 'Not found'
    // });
    res.status(404).send('404 Not found!');
  });

};
