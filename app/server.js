var path = require('path');
var express = require('express');
var logger = require('morgan');
var slashes = require('connect-slashes');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var csrf = require('csurf');
var multer = require('multer');
var flash = require('connect-flash');
var passport = require('passport');


require('node-jsx').install({extension: '.jsx'});

var stylusMiddleware = require('../config/middleware/stylus.js');
var render = require('./helpers/render.js');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = function(mongooseConnection, redisClient) {

  require('../config/passport.js')(passport);

  var app = express();

  // Middleware

  // In production we use a CDN
  if (!isProduction) {
    app.use(stylusMiddleware());
  }

  app.use(slashes(false));
  app.use(logger('dev'));
  app.use(express.static(path.join(__dirname, '../public')));

  app.engine('jsx', render);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jsx');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(multer());

  app.use(cookieParser());
  app.use(session({
    resave: false, //don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'bodhi',
    store: new RedisStore({
      client: redisClient,
      host: isProduction ? '127.0.0.1' : 'redis',
      ttl: 14 * 86400 // 14 days expiration
    })
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Always after sessions
  app.use(flash());


  var csrfMiddleware = csrf();
  app.use(function(req, res, next) {
    // The token route is getting redirected so a CSRF isn't sent
    // This uses an authorization code for security
    if (req.originalUrl === '/oauth/token') {
      return next()
    }

    // Don't need CSRF w/ access tokens
    var isAPI = req.originalUrl.slice(0, 4) === '/api';
    var accessToken = req.query.access_token || req.body.access_token || null;
    if (!isAPI || !accessToken) {
      csrfMiddleware.apply(null, arguments);
    } else {
      next()
    }
  });
  app.use(function(req, res, next) {
    if (req.csrfToken)
      res.locals.csrf_token = req.csrfToken();
    next();
  });

  // Pretty print
  if (app.get('env') === 'development') {
    app.set('json spaces', 2);
    // app.locals.pretty = true;
  }

  // Append the user to the locals for use in every view
  app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
  });

  require('../config/routes.js')(app, passport);

  app.listen(process.env.PORT || 8080);

};
