// Currently, the fetch API doesn't reliably parse the UTF-8 encoded json
// correctly. Here we just force the polyfill
window.fetch = null;
require('whatwg-fetch');
var React  = require('react');
var toolbelt = require('../utils/toolbelt.js');
var location = require('../helpers/location');
var ActionCreators = require('../actions/actionCreators');
var GetStarted = React.createFactory(require('../views/getStarted.jsx'));


// Application state:
var state = new toolbelt.clone(window.appData);

// Add the component to the DOM
var targetNode = document.querySelector('#page');

function renderApp() {
  React.render( GetStarted( state ), targetNode );
}

renderApp();

setTimeout(function() {
  state.checkingLocation = true;
  renderApp();
}, 10);

// Request the user's location
ActionCreators.getUserLocationAndTimezone(state.user)
  .then(function(positionData) {

    var user = state.user;
    var coords = user.coords || {};

    if (user.location !== positionData.location ||
        user.tz !== positionData.tz ||
        coords.lat !== positionData.coords.lat ||
        coords.long !== positionData.coords.long) {
      state.user = toolbelt.extend(state.user, positionData);
      state.checkingLocation = false;
    } else {
      state.checkingLocation = false;
    }
    renderApp();
  })
  .catch(function(err) {
    console.error(err);
    state.checkingLocation = false;
    renderApp();
  });
