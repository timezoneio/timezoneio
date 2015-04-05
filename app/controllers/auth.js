var React = require('react');

var render = require('../helpers/render.js');
var Login = require('../views/login.jsx');

var auth = module.exports = {};


auth.login = function(req, res) {

  var body = React.renderToString(
    Login({})
  );

  var params = {
    body: body,
    script: 'bundles/login.js'
  };

  render(req, res, params);
};

auth.session = function(req, res) {


};