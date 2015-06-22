var moment = require('moment-timezone');
var toolbelt = require('../utils/toolbelt.js');
var transform = require('../utils/transform.js');


// Constructor
var AppState = module.exports = function(initialState) {

  this._state = toolbelt.clone(window.appData);

  this._state.time = moment(this._state.time);

  this.updateTimezones();

};


AppState.prototype.getState = function() {
  return this._state;
};

AppState.prototype.getCSRF = function() {
  return this._state.csrf_token;
};

AppState.prototype.getTeam = function() {
  return this._state.team;
};

AppState.prototype.getPersonById = function(id) {
  return this._state.people.filter(function(p) { return p._id === id; })[0];
};

AppState.prototype.updateTimezones = function() {
  this._state.timezones = transform(this._state.time, this._state.people);
};


// Assumes time is not current :/
AppState.prototype.setTime = function(timeMoment) {
  this._state.time = timeMoment;
  this._state.isCurrentTime = false;
};

AppState.prototype.updateToCurrentTime = function() {
  var now = moment();

  if (now.hour() === this._state.time.hour() &&
      now.minute() === this._state.time.minute())
    return;

  this._state.time.hour( now.hour() );
  this._state.time.minute( now.minute() );
  this._state.isCurrentTime = true;
};

AppState.prototype.setTimeFormat = function(format) {
  this._state.timeFormat = format;
};

AppState.prototype.getCurrentView = function() {
  return this._state.currentView;
};

AppState.prototype.setCurrentView = function(view) {
  this._state.currentView = view;
};

AppState.prototype.updateUserData = function(data) {
  if (this._state.user._id === data._id) {
    toolbelt.update(this._state.user, data);
  }

  var person = this.getPersonById(data._id);
  if (person) {
    // Clear the Moment object before updating data,
    // we will append this in transform
    delete person.time;
    toolbelt.update(person, data);
  } else {
    this._state.people.push(data); // New team member
  }

  // Update the timezone data:
  this.updateTimezones();
};
