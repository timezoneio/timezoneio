require('../helpers/fetchPolyfill');
var React  = require('react');

var Contact = React.createFactory(require('../views/Contact.jsx'));

var targetNode = document.querySelector('#page');

React.render(
  Contact(appData),
  targetNode
);
