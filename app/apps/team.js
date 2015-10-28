require('../helpers/fetchPolyfill');
var React  = require('react');
var moment = require('moment-timezone');

var transform = require('../utils/transform.js');
var timeUtils = require('../utils/time.js');
var clone = require('../utils/toolbelt.js').clone;
var KEY = require('../helpers/keyConstants');

var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');
var ActionCreators = require('../actions/actionCreators');
var AppState = require('../state/appState.js');

var Team = React.createFactory(require('../views/team.jsx'));


// Application state:
var appState = new AppState(window.appData);

// Get non-user settings:
if (!appState.getUser()) {
  var fmt = window.localStorage.getItem('tz:timeFormat');
  if (fmt) appState.setTimeFormat(parseInt(fmt, 10));
}

// Add the component to the DOM
var targetNode = document.querySelector('#page');

function renderApp() {
  React.render( Team( appState.getState() ), targetNode );
}

renderApp();

// Allow arrow keys to change time by selecting time range input
// Allow / key to select search
// NOTE - not caching variables b/c of manage view removes items from DOM
var handleKeyUp = function(e) {
  if (e.target.nodeName === 'INPUT' || e.target.nodeName === 'TEXTAREA')
    return;

  var keyCode = e.keyCode;
  var key = e.key || '';

  if (key === '/' || keyCode === KEY.SLASH) {
    e.preventDefault();
    document.querySelector('.team-search-input').focus();
    return;
  }

  if (keyCode === KEY.RIGHT || keyCode === KEY.LEFT) {
    e.preventDefault();
    disableAutoUpdate();
    document.querySelector('.time-slider').focus();
    renderApp();
  }
};

var enableKeyTimeChange = function() {
  window.addEventListener('keyup', handleKeyUp);
};
var disableKeyTimeChange = function() {
  window.removeEventListener('keyup', handleKeyUp);
};

if (appState.getCurrentView() === 'app') {
  enableKeyTimeChange();
}


function updateToCurrentTime() {
  appState.updateToCurrentTime();
  renderApp();
}

// 0 is now, 1.0 is in 12 hours, -1.0 is 12 hours ago
function updateTimeAsPercent(percentDelta) {

  if (percentDelta === 0) {
    enableAutoUpdate();
    return updateToCurrentTime();
  }

  var MIN_IN_12_HOURS = 720;
  var deltaMinutes = MIN_IN_12_HOURS * percentDelta;

  var now = moment();
  now.add(deltaMinutes, 'm');

  // Round to quarter hour
  var minutes = now.minutes();
  now.add(timeUtils.roundToQuarterHour(minutes) - minutes, 'm');

  appState.setTime(now);

  renderApp();
}


function json(res) {
  return res.json();
}
function saveTeamInfo(info) {

  info._csrf = appState.getCSRF();

  var options = {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(info)
  };

  return fetch('/api/team/' + appState.getTeam()._id, options)
    .then(json)
    .then(function(res){
      return res;
    });
}

function saveUserTimeFormat(format) {
  var user = appState.getUser();
  if (user)
    return ActionCreators.saveUserSetting(user._id, 'timeFormat', format);

  window.localStorage.setItem('tz:timeFormat', format);
}

function updateCurrentView(view, shouldUpdateUrl) {

  appState.setCurrentView(view);

  if (shouldUpdateUrl) {
    var path = appState.getTeam().url;

    if (view !== 'app') {
      path += '/' + view;
      disableKeyTimeChange();
    } else {
      enableKeyTimeChange();
    }

    window.history.pushState({}, null, path);
  }

  renderApp();
}

function handlePopState(e) {
  var path = window.location.pathname;
  var segment = path.replace(appState.getTeam().url, '');
  var view = segment.length ? segment.substr(1) : 'app';
  updateCurrentView(view);
}

function updateTeamUrl(newTeamUrl) {
  var currentPath = window.location.pathname;
  var newPath = currentPath.replace(/\/team\/.+\//, newTeamUrl);
  window.history.pushState({}, null, newPath);
}


window.addEventListener('popstate', handlePopState);

var handleViewAction = function(action) {
  var actionType = action.actionType;
  var value = action.value;
  var shouldRender = false;

  switch (actionType) {

    case ActionTypes.SEARCH_TEAM:
      appState.setActiveFilter(value);
      shouldRender = true;
      break;

    case ActionTypes.CHANGE_TIME_FORMAT:
      appState.setTimeFormat(value);
      saveUserTimeFormat(value);
      shouldRender = true;
      break;
    case ActionTypes.USE_CURRENT_TIME:
      updateToCurrentTime();
      enableAutoUpdate();
      break;
    case ActionTypes.ADJUST_TIME_DISPLAY:
      disableAutoUpdate();
      updateTimeAsPercent(value);
      break;

    case ActionTypes.CLOSE_MODAL:
      updateCurrentView('app', true);
      break;
    case ActionTypes.SHOW_VIEW:
      updateCurrentView(value, true);
      break;

    case ActionTypes.SAVE_TEAM_INFO:
      saveTeamInfo(value);
      break;

    case ActionTypes.TOGGLE_SELECT_PERSON:
      appState.toggleSelectPerson(value);
      shouldRender = true;
      break;

    case ActionTypes.CLEAR_MEETING_GROUPS:
      appState.clearMeetingGroups();
      shouldRender = true;
      break;

    case ActionTypes.UPDATE_TEAM_URL:
      updateTeamUrl(value);
      break;

  }

  if (shouldRender) renderApp();
};

var handleAPIAction = function(action) {
  var actionType = action.actionType;
  var value = action.value;

  switch (actionType) {

    case ActionTypes.UPDATED_TEAM_DATA:
      appState.updateTeamData(value);
      renderApp();
      break;

    case ActionTypes.UPDATED_USER_DATA:
      appState.updateUserData(value);
      renderApp();
      break;

    case ActionTypes.TEAM_MEMBER_REMOVED:
      appState.removeTeamMember(value);
      renderApp();
      break;

  }
};

AppDispatcher.register(function(payload) {

  if (payload.source === 'API_ACTION')
    handleAPIAction(payload.action);
  else if (payload.source === 'VIEW_ACTION')
    handleViewAction(payload.action);

});



// Auto updating the time

var autoUpdateIntervalId = null;
function enableAutoUpdate() {

  // Check every 20 seconds for an updated time
  autoUpdateIntervalId = setInterval(updateToCurrentTime, 1000 * 20);

  // Check on window focus
  window.onfocus = updateToCurrentTime;
}

function disableAutoUpdate() {
  clearInterval(autoUpdateIntervalId);
  window.onfocus = null;
}

enableAutoUpdate();
