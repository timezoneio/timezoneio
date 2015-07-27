var moment = require('moment-timezone');
var toolbelt = require('../utils/toolbelt.js');
var transform = require('../utils/transform.js');


// Constructor
var AppState = module.exports = function(initialState) {

  this._state = toolbelt.clone(window.appData);

  this._state.time = moment(this._state.time);
  this._state.meeting = {
    people: []
  };

  this.updateTimezones();

  // DEBUG
  Object.observe(this._state, function(changes) {
    console.log(changes);
  });

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

AppState.prototype.removeTeamMember = function(data) {
  var idx = this._state.people.map(function(p) { return p._id; })
                              .indexOf(data.usedId);
  if (idx > -1) {
    this._state.people.splice(idx, 1);
    this.updateTimezones();
  }
};

AppState.prototype.toggleSelectPerson = function(id) {
  var idx = this._state.meeting.people.map(function(p) { return p._id; })
                                      .indexOf(id);
  if (idx === -1)
    this._state.meeting.people.push(this.getPersonById(id));
  else
    this._state.meeting.people.splice(idx, 1);
};
