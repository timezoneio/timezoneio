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


// Should switch this out for proper Handlebars usage
function render(params, done) {

  params.title = params.title ? 'Timezone.io - ' + params.title : 'Timezone.io';
  params.body = params.body || '404 :(';
  params.data = JSON.stringify(params.data || {});
  params.script = params.script || '/js/genericPage.js';

  var page = Object.keys(params).reduce(function(page, key) {
    return page.replace('{{{' + key + '}}}', params[key]);
  }, template);

  done(null, page);
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
    title: 'Keep track where and when your team is.',
    body: body,
    script: 'bundles/homepage.js'
  };

  render(params, function(err, html){
    if (err) throw err;
    res.send(html);
  });

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

  render(params, function(err, html){
    if (err) throw err;
    res.send(html);
  });

});

// Static files
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 8080);
