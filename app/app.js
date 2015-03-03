var React  = require('react');
var moment = require('moment-timezone');
var transform = require('./utils/transform.js');
var AppDispatcher = require('./dispatchers/appDispatcher.js');
var ActionTypes = require('./actions/actionTypes.js');
var App = React.createFactory(require('./views/app.jsx'));


// Organize into timezones
var appData = window.appData;
var time = moment(appData.time);
var timezones = transform(time, appData.people);
var timeFormat = appData.timeFormat;

window.timezones = timezones;

// Add the component to the DOM
var targetNode = document.querySelector('#page');

function renderApp() {
  React.render(
    App({
      time: time,
      timezones: timezones,
      timeFormat: timeFormat
    }),
    targetNode
  );
}

renderApp();

var KEY = {
  LEFT:  37,
  RIGHT: 39
};

// Listen to keyup for timechange
window.addEventListener('keyup', function(e){

  if (e.keyCode === KEY.RIGHT){
    time.add(1, 'h');
  } else if (e.keyCode === KEY.LEFT){
    time.subtract(1, 'h');
  }

  // Push new data to re-render component
  renderApp();

});

function updateToCurrentTime() {
  var now = moment();
  if (now.hour() === time.hour() && now.minute() === time.minute()) return;

  time.hour( now.hour() );
  time.minute( now.minute() );
}

AppDispatcher.register(function(payload) {

  // console.info('EVENT: ', payload);

  var actionType = payload.action.actionType;
  var value = payload.action.value;

  switch (actionType) {
    case ActionTypes.CHANGE_TIME_FORMAT:
      timeFormat = value;
      break;
  }

  renderApp();
});

// Check every 10 seconds for an updated time
// setInterval(reRender, 1000 * 10);

// Check on window focus
window.onfocus = function() {
  updateToCurrentTime();
  renderApp();
};
