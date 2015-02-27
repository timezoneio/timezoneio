var express = require('express');
var app = express();
var logger = require('morgan');
var stylus = require('stylus');
var autoprefixer  = require('autoprefixer-stylus');
var React = require('react');
var moment = require('moment-timezone');
var fs = require('fs');

var people = require('./people.json');
var transform = require('./app/utils/transform.js');
var strings = require('./app/utils/strings.js');

// Allow direct requiring of .jsx files
require('node-jsx').install({extension: '.jsx'});

// React views
var App = require('./app/views/app.jsx');
var Homepage = require('./app/views/homepage.jsx');

// Read the main template in once
var template = fs.readFileSync('./app/templates/layout.hbs', 'utf8');


var defaultDescription = 'Keep track where and when your team is. ' +
  'Timezone.io is a simple way to display the local time for members of your global, remote, nomadic team.';

function render(req, res, params) {

  params.title = params.title ? 'Timezone.io - ' + params.title : 'Timezone.io';
  params.description = params.description || defaultDescription;
  params.url = 'http://timezone.io' + req.url;
  params.body = params.body || '404 :(';
  params.data = JSON.stringify(params.data || {});
  params.script = params.script || '/js/genericPage.js';

  var html = Object.keys(params).reduce(function(page, key) {
    var reggae = new RegExp('{{{' + key + '}}}', 'g');
    return page.replace(reggae, params[key]);
  }, template);

  res.send(html);
}

app.use(logger('common'));

// Stylus
app.use(
  stylus.middleware({
    src:     __dirname + '/assets',
    dest:    __dirname + '/public',
    compile: function (str, path, fn) {
      return stylus(str)
        .use(autoprefixer())
        .set('filename', path)
        .set('compress', true);
    }
  })
);

app.get('/', function(req, res) {

  var body = React.renderComponentToString(
    Homepage()
  );

  var params = {
    body: body,
    script: 'bundles/homepage.js'
  };

  render(req, res, params);

});

app.get('/team/:name', function(req, res) {
  
  // Organize into timezones
  var time = moment();
  var timezones = transform(time, people);

  var body = React.renderComponentToString(
    App({
      time: time,
      timezones: timezones
    })
  );

  var params = {
    title: strings.capFirst(req.params.name),
    body: body,
    script: 'bundles/app.js',
    data: {
      time: time,
      people: people
    }
  };

  render(req, res, params);

});

// Static files
app.use(express.static(__dirname + '/public'));

//process.env.PORT || 
app.listen(8080);
