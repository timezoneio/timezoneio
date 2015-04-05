var React = require('react');

var render = require('../helpers/render.js');
var Homepage = require('../views/homepage.jsx');

var base = module.exports = {};


base.index = function(req, res) {
  var body = React.renderToString(
    Homepage()
  );

  var params = {
    body: body,
    script: 'bundles/homepage.js'
  };

  render(req, res, params);
};