var React  = require('react');

var Person = React.createFactory(require('./views/person.jsx'));

var targetNode = document.querySelector('#page');

React.render(
  Person(window.appData),
  targetNode
);