// Currently, the fetch API doesn't reliably parse the UTF-8 encoded json
// correctly. Here we just force the polyfill
window.fetch = null;
require('whatwg-fetch');
var React  = require('react');
var clone = require('../utils/toolbelt.js').clone;
var location = require('../helpers/location');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var GetStarted = React.createFactory(require('../views/getStarted.jsx'));


// Application state:
var state = new clone(window.appData);


// Add the component to the DOM
var targetNode = document.querySelector('#page');

function renderApp() {
  React.render( GetStarted( state ), targetNode );
}

renderApp();

// Request the user's locaiton
location.getCurrentPosition()
  .then(function(coords) {

    state.user.coords = {
      lat: coords.latitude,
      long: coords.longitude
    };

    // Run in parallel
    return Promise.all([
      location.getCityFromCoords(state.user.coords),
      location.getTimezomeFromCoords(state.user.coords)
    ]);
  })
  .then(function(values) {
    state.user.location = values[0];
    state.user.tz = values[1];
    renderApp();
  })
  .catch(function(err) {
    console.error(err);
  });
