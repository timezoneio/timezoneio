require('../helpers/fetchPolyfill');
const React = require('react');
const toolbelt = require('../utils/toolbelt.js');
const Home = React.createFactory(require('../views/Home.jsx'));

const targetNode = document.querySelector('#page');

React.render(
  Home(toolbelt.clone(window.appData)),
  targetNode
);
