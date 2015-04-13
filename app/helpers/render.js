/**
 * Render an html document given Express request, response and params
 */

var fs = require('fs');
var path = require('path');
var Mustache = require('mustache');
var React = require('react');

// Read the main template in once
var template = fs.readFileSync(path.join(__dirname, '../templates/layout.hbs'), 'utf8');

var defaultDescription = 'Keep track where and when your team is. ' +
  'Timezone.io is a simple way to display the local time for members of your global, remote, nomadic team.';

//NOTE - I don't know if there is overhead of requiring the view each time
module.exports = function render(pathName, locals, cb) {
    
  var ViewComponent = require(pathName);

  var params = {};
  
  params.data = locals || {};
  params.data.csrf_token = locals.csrf_token;

  params.body = React.renderToString(
    ViewComponent(params.data)
  );

  //NOTE - currently this.name will always be truthy
  params.script ='bundles/' + this.name + '.js';
  // params.script = this.name ?
  //                 '/js/bundles/' + this.name + '.js' :
  //                 '/js/genericPage.js';

  params.title = params.data.title ? 'Timezone.io - ' + params.data.title : 'Timezone.io';
  params.description = params.data.description || defaultDescription;
  params.url = 'http://timezone.io'; // + req.url;
  params.body = params.body || '404 :(';
  params.data = JSON.stringify(params.data || {});

  var html = Mustache.render(template, params);

  cb(null, html);
};