var path = require('path');
var express = require('express');
var logger = require('morgan');
var slashes = require('connect-slashes');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var session = require('express-session');
var passport = require('passport');
var mongoStore = require('connect-mongo')(session);

require('node-jsx').install({extension: '.jsx'});

var stylusMiddleware = require('../config/middleware/stylus.js');


module.exports = function() {

  var app = express();

  // Middleware
  app.use(stylusMiddleware());
  app.use(slashes(false));
  app.use(logger('common'));
  app.use(express.static(path.join(__dirname, '../public')));

  app.use(cookieParser());
  app.use(cookieSession({ secret: 'secret' }));
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'bodhi',
    store: new mongoStore({
      url: 'mongodb://localhost/timezone',
      collection : 'sessions'
    })
  }));

  require('../config/passport.js')(passport);

  require('../config/routes.js')(app, passport);  

  app.listen(8080);

};

