var React = require('react');
var clone = require('../utils/clone.js');
var Person = React.createFactory(require('../views/person.jsx'));

var targetNode = document.querySelector('#page');

React.render(
  Person(clone(window.appData)),
  targetNode
);
