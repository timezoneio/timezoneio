var React  = require('react');
var moment = require('moment-timezone');
var transform = require('./utils/transform.js');
var AppDispatcher = require('./dispatchers/appDispatcher.js');
var ActionTypes = require('./actions/actionTypes.js');
var App = React.createFactory(require('./views/app.jsx'));


// Organize into timezones
var appData = window.appData;
// var currentTime = moment(appData.time);
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

// Allow arrow keys to change time by selecting time range input
var KEY = {
  LEFT:  37,
  RIGHT: 39
};
var timeSlider = document.querySelector('.time-slider');

window.addEventListener('keyup', function(e){

  if (e.keyCode === KEY.RIGHT || e.keyCode === KEY.LEFT) {
    disableAutoUpdate();
    timeSlider.focus();
    renderApp();
  }
  
});

function updateToCurrentTime() {
  var now = moment();
  if (now.hour() === time.hour() && now.minute() === time.minute()) return;

  time.hour( now.hour() );
  time.minute( now.minute() );
}

// 0 is now, 100% is in 12 hours, 0% is 12 hours ago
function updateTimeAsPercent(percentDelta) {
  var MIN_IN_12_HOURS = 720;
  var deltaMinutes = MIN_IN_12_HOURS * percentDelta;
  var now = moment();
  now.add(deltaMinutes, 'm');
  time = now;
}

AppDispatcher.register(function(payload) {

  // console.info('EVENT: ', payload);

  var actionType = payload.action.actionType;
  var value = payload.action.value;

  switch (actionType) {
    case ActionTypes.CHANGE_TIME_FORMAT:
      timeFormat = value;
      break;
    case ActionTypes.RESET_TIME_CURRENT:
      updateToCurrentTime();
      break;
    case ActionTypes.ADJUST_TIME_DISPLAY:
      disableAutoUpdate();
      updateTimeAsPercent(value);
      break;
  }

  renderApp();
});



// Auto updating the time
// This will automatically make the display time update to the current time
function updateOnFocus() {
  updateToCurrentTime();
  renderApp();
}

var autoUpdateIntervalId = null;
function enableAutoUpdate() {

  // Check every 30 seconds for an updated time
  autoUpdateIntervalId = setInterval(renderApp, 1000 * 30);

  // Check on window focus
  window.onfocus = updateOnFocus;
}

function disableAutoUpdate() {
  clearInterval(autoUpdateIntervalId);
  window.onfocus = null;
}

enableAutoUpdate();
