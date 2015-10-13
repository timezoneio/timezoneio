require('../helpers/fetchPolyfill');
var React  = require('react');

var Homepage = React.createFactory(require('../views/homepage.jsx'));

var targetNode = document.querySelector('#page');

React.render(
  Homepage(appData),
  targetNode
);
