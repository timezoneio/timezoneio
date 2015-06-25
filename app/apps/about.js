var React  = require('react');

var About = React.createFactory(require('../views/about.jsx'));

var targetNode = document.querySelector('#page');

React.render(
  About(appData),
  targetNode
);
