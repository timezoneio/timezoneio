/**
 * Render an html document given Express request, response and params
 */

var fs = require('fs');
var path = require('path');

// Read the main template in once
var template = fs.readFileSync(path.join(__dirname, '../templates/layout.hbs'), 'utf8');

var defaultDescription = 'Keep track where and when your team is. ' +
  'Timezone.io is a simple way to display the local time for members of your global, remote, nomadic team.';

module.exports = function render(req, res, params) {

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

};