var path = require('path');
var express = require('express');
var logger = require('morgan');
var stylus = require('stylus');
var autoprefixer  = require('autoprefixer-stylus');
var React = require('react');

require('node-jsx').install({extension: '.jsx'});


var render = require('./helpers/render.js');

var teamController = require('./controllers/team.js');

// React views
var Homepage = require('../app/views/homepage.jsx');


// Stylus
var stylusMiddleware = stylus.middleware({
  src:     path.join(__dirname, '../assets'),
  dest:    path.join(__dirname, '../public'),
  compile: function (str, path, fn) {
    return stylus(str)
      .use(autoprefixer())
      .set('filename', path)
      .set('compress', true);
  }
});

var home = function(req, res) {

  var body = React.renderToString(
    Homepage()
  );

  var params = {
    body: body,
    script: 'bundles/homepage.js'
  };

  render(req, res, params);

};

module.exports = function() {
  var app = express();

  app.get('/', home);
  app.get('/team/:name', teamController.index);

  app.use(stylusMiddleware);
  app.use(logger('common'));
  app.use(express.static(path.join(__dirname, '../public')));
  app.listen(8080);
};

