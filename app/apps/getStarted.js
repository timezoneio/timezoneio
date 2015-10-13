require('../helpers/fetchPolyfill');
var React  = require('react');
var toolbelt = require('../utils/toolbelt.js');
var location = require('../helpers/location');
var ActionCreators = require('../actions/actionCreators');
var GetStarted = React.createFactory(require('../views/getStarted.jsx'));


// Application state:
var state = new toolbelt.clone(window.appData);

state.handleLocationChange = function(location, tz) {
  state.user.location = location;
  state.user.tz = tz;
  renderApp();
};

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
    state.locationField = true;
    state.checkingLocation = false;
    renderApp();
  });
