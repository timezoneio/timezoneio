require('../helpers/fetchPolyfill');
var React  = require('react');

var Account = React.createFactory(require('../views/Account.jsx'));

var targetNode = document.querySelector('#page');

React.render(
  Account(appData),
  targetNode
);
