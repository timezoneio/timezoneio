var moment = require('moment-timezone');
var toolbelt = require('../utils/toolbelt.js');
var transform = require('../utils/transform.js');
var timeUtils = require('../utils/time.js');


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

  this.organizeMeetingGroups();
  this.findMeetingTime();
};


AppState.prototype.organizeMeetingGroups = function() {
  var zoneGroups = toolbelt.groupBy('zone', this._state.meeting.people);

  this._state.meeting.groups = Object.keys(zoneGroups)
                                     .sort()
                                     .map(function(z) {
                                       var zone = parseInt(z, 10);
                                       return {
                                         zone: zone,
                                         zoneHours: zone / 60,
                                         people: zoneGroups[z]
                                       };
                                     });
};

var createHoursArray = function() {
  var hours = [];
  for (var i = 0; i < 24; i++) hours.push(i);
  return hours;
};

var createHoursArrayForOffset = function(zoneHours) {
  var hours = createHoursArray();
  if (zoneHours === 0)
    return hours;
  if (zoneHours > 0) {
    var end = hours.splice(24 - zoneHours);
    return end.concat(hours);
  } else {
    var start = hours.splice(Math.abs(zoneHours));
    return start.concat(hours);
  }
};

var isWorkHour = function(hour) {
  return hour >= 9 && hour <= 18; // 9-6
};

var getLongestContinuousSegment = function(hours) {
  var segments = [];
  var activeSegment = [];
  var twoDays = hours.concat(hours);
  for (var i = 0; i < 48; i++) {
    var hour = twoDays[i];
    if (hour === null && activeSegment.length) {
      segments.push(activeSegment);
      activeSegment = [];
    } else if (hour !== null) {
      activeSegment.push(hour);
    }
  }
  if (activeSegment.length)
    segments.push(activeSegment);

  var longestSegment = segments.reduce(function(longest, segment) {
    return segment.length > longest.length ? segment : longest;
  }, []);

  return longestSegment;
};

AppState.prototype.findMeetingTime = function() {

  this._state.meeting.groups.forEach(function(group) {
    group.hours = createHoursArrayForOffset(group.zoneHours);
  });

  var hoursMatrix = this._state.meeting.groups.map(function(group) {
    return group.hours;
  });

  var gmtHours = createHoursArray();
  var availableHoursIndexes = gmtHours.map(function(hour, idx) {
    return hoursMatrix.reduce(function(isAvailable, hoursSet) {
      return isAvailable && isWorkHour(hoursSet[idx]);
    }, true);
  });

  this._state.meeting.availableHoursIndexes = availableHoursIndexes;

  // Get suggested local time window
  var localZoneHours = moment().zone() / 60;
  var localHours = createHoursArrayForOffset(localZoneHours);
  var localAvailableHours = localHours.map(function(hour, idx) {
    return availableHoursIndexes[idx] ? hour : null;
  });
  // find biggest continuous segment
  var suggestedTimeSegment = getLongestContinuousSegment(localAvailableHours);
  var startHour = suggestedTimeSegment[0];
  var endHour = suggestedTimeSegment[suggestedTimeSegment.length - 1];
  var suggestedTime = timeUtils.getHourFormattedString(startHour) +
                      ' - ' +
                      timeUtils.getHourFormattedString(endHour);

  this._state.meeting.suggestedTime = suggestedTime;

};
