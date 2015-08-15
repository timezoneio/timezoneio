var React = require('react');
var toolbelt = require('../utils/toolbelt.js');
var CreateTeam = React.createFactory(require('../views/createTeam.jsx'));

var targetNode = document.querySelector('#page');

React.render(
  CreateTeam(toolbelt.clone(window.appData)),
  targetNode
);
