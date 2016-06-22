require('../helpers/fetchPolyfill');
var React = require('react');
var moment = require('moment-timezone');
var throttle = require('lodash/function/throttle');

var timeUtils = require('../utils/time.js');
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
  const fmt = window.localStorage.getItem('tz:timeFormat');
  if (fmt) appState.setTimeFormat(parseInt(fmt, 10));
}

// Add the component to the DOM
const targetNode = document.querySelector('#page');

function renderApp() {
  React.render(Team(appState.getState()), targetNode);
}

renderApp();

function updateToCurrentTime() {
  appState.updateToCurrentTime();
  renderApp();
}

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


// Allow arrow keys to change time by selecting time range input
// Allow / key to select search
// NOTE - not caching variables b/c of manage view removes items from DOM
const handleKeyDown = function(e) {
  if (e.target.nodeName === 'INPUT' || e.target.nodeName === 'TEXTAREA')
    return;

  const keyCode = e.keyCode;
  const key = e.key || '';

  if (key === '/' || keyCode === KEY.SLASH) {
    e.preventDefault();
    document.querySelector('.team-search-input').focus();
    return;
  }

  // NOTE - This doesn't work anymore when the slider is hidden
  if (key === 'ArrowLeft' || key === 'ArrowRight' ||
      keyCode === KEY.RIGHT || keyCode === KEY.LEFT) {
    e.preventDefault();
    disableAutoUpdate();
    document.querySelector('.time-slider').focus();
    renderApp();
  }
};

const enableKeyboardShortcuts = function() {
  window.addEventListener('keydown', handleKeyDown);
};
const disableKeyboardShortcuts = function() {
  window.removeEventListener('keydown', handleKeyDown);
};

if (appState.getCurrentView() === 'app') {
  enableKeyboardShortcuts();
}


// 0 is now, 1.0 is in 12 hours, -1.0 is 12 hours ago
function updateTimeAsPercent(percentDelta) {
  if (percentDelta === 0) {
    enableAutoUpdate();
    return updateToCurrentTime();
  }

  const MIN_IN_12_HOURS = 720;
  const deltaMinutes = MIN_IN_12_HOURS * percentDelta;

  var now = moment();
  now.add(deltaMinutes, 'm');

  // Round to quarter hour
  const minutes = now.minutes();
  now.add(timeUtils.roundToQuarterHour(minutes) - minutes, 'm');

  appState.setTime(now);

  renderApp();
}

var updateTimeAsPercentThrottled = throttle(updateTimeAsPercent, 100);


function json(res) {
  return res.json();
}
function saveTeamInfo(info) {
  info._csrf = appState.getCSRF();

  var options = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(info)
  };

  return fetch(`/api/team/${appState.getTeam()._id}`, options)
    .then(json);
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
      path += `/${view}`;
      disableKeyboardShortcuts();
    } else {
      enableKeyboardShortcuts();
    }

    window.history.pushState({}, null, path);
  }

  renderApp();
}

function handlePopState() {
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
      updateTimeAsPercentThrottled(value);
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

    default:
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

    default:
      break;

  }
};

AppDispatcher.register((payload) => {
  if (payload.source === 'API_ACTION')
    handleAPIAction(payload.action);
  else if (payload.source === 'VIEW_ACTION')
    handleViewAction(payload.action);
});
