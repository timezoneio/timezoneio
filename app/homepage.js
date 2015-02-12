var React  = require('react');
var moment = require('moment-timezone');

var Homepage = React.createFactory(require('./views/homepage.jsx'));

var targetNode = document.querySelector('#page');

React.render(
  Homepage({
    // data?
  }),
  targetNode
);