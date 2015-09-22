/**
 * Render an html document given Express request, response and params
 */

var fs = require('fs');
var path = require('path');
var Mustache = require('mustache');
var React = require('react');

const STATIC_VERSIONS = require('../../rev-manifest.json');
const STATIC_DOMAIN = '//s3.amazonaws.com/timezoneio/';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ICON_STYLESHEET = IS_PRODUCTION ?
                        'https://fonts.googleapis.com/icon?family=Material+Icons' :
                        '/stylesheets/material-design-icons.css';

var getStaticUrl = function(relUrl) {
  if (IS_PRODUCTION && relUrl in STATIC_VERSIONS)
    return STATIC_DOMAIN + STATIC_VERSIONS[relUrl];
  return '/' + relUrl;
};

// Read the main template in once
var template = fs.readFileSync(path.join(__dirname, '../templates/layout.hbs'), 'utf8');

var defaultDescription = 'Keep track where and when your team is. ' +
  'Timezone.io is a simple way to display the local time for members of your global, remote, nomadic team.';

//NOTE - I don't know if there is overhead of requiring the view each time
module.exports = function render(pathName, locals, cb) {

  var ViewComponent = require(pathName);

  var data = locals || {};
  data.csrf_token = locals.csrf_token;

  // clean user object for render
  if (data.user)
    data.user = data.user.toOwnerJSON();

  var params = {};

  params.body = React.renderToString(
    React.createElement(ViewComponent, data)
  );
  params.data = JSON.stringify(data || {});

  params.icons = ICON_STYLESHEET;
  params.stylesheet = getStaticUrl('stylesheets/index.css');
  if (!locals.noScript)
    params.script = getStaticUrl('js/bundles/' + this.name + '.js');

  // IDEA for generic bundle page
  // params.script = this.name ?
  //                 '/js/bundles/' + this.name + '.js' :
  //                 '/js/genericPage.js';

  params.title = data.title ? 'Timezone.io - ' + data.title : 'Timezone.io';
  params.description = data.description || defaultDescription;
  params.url = 'http://timezone.io'; // + req.url;
  params.body = params.body || '404 :(';

  var html = Mustache.render(template, params);

  cb(null, html);
};
