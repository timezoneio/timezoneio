var moment = require('moment-timezone');
var clone = require('../utils/clone.js');
var toolbelt = require('../utils/toolbelt.js');
var transform = require('../utils/transform.js');


// Constructor
var AppState = module.exports = function(initialState) {

  this._state = clone(window.appData);

  this._state.time = moment(this._state.time);
  this._state.timezones = transform(moment(this._state.time), this._state.people);

};


// Generic methods:

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


// Data-manipulating methods:

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

AppState.prototype.setCurrentView = function(view) {
  this._state.currentView = view;
};

AppState.prototype.updateUserData = function(data) {
  if (this._state.user._id === data._id) {
    toolbelt.extend(this._state.user, data);
  }

  var person = this.getPersonById(data._id);
  toolbelt.extend(person, data);
};
