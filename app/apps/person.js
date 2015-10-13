require('../helpers/fetchPolyfill');
var React = require('react');
var toolbelt = require('../utils/toolbelt.js');
var Person = React.createFactory(require('../views/person.jsx'));

var targetNode = document.querySelector('#page');

React.render(
  Person(toolbelt.clone(window.appData)),
  targetNode
);
