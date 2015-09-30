var React  = require('react');

var Admin = React.createFactory(require('../views/admin.jsx'));

var targetNode = document.querySelector('#page');

React.render(
  Admin(appData),
  targetNode
);
