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
  // Object.observe(this._state, function(changes) {
  //   console.log(changes);
  // });

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

AppState.prototype.getGMTAvailableHoursForGroups = function(groups, workStartHour, workEndHour) {
  if (!workStartHour) workStartHour = 9;
  if (!workEndHour) workEndHour = 18;

  var isWorkHour = function(hour) {
    return hour >= workStartHour && hour <= workEndHour;
  };

  var hoursMatrix = groups.map(function(group) {
    return group.hours;
  });

  var gmtHours = createHoursArray();
  var availableHoursIndexes = gmtHours.map(function(hour, idx) {
    return hoursMatrix.reduce(function(isAvailable, hoursSet) {
      return isAvailable && isWorkHour(hoursSet[idx]);
    }, true);
  });

  var hasAvailableHours = !!availableHoursIndexes.filter(function(isAvailable) {
    return isAvailable;
  }).length;

  // We don't expand the window beyond 6am-9pm
  var isExpandable = workStartHour !== 6 && workEndHour !== 21;

  // If there isn't any overlap time, we expand the work day by 1 hour in both directions
  if (!hasAvailableHours && isExpandable)
    return this.getGMTAvailableHoursForGroups(groups,
                                              Math.max(6, workStartHour - 1),
                                              Math.min(21, workEndHour + 1));

  // this._state.meeting.availableHoursIndexes = availableHoursIndexes;

  // Get the suggested metting time in hours GMT
  var gmtAvailableHours = gmtHours.map(function(hour, idx) {
    return availableHoursIndexes[idx] ? hour : null;
  });

  return gmtAvailableHours;
};

AppState.prototype.getSuggestedMeetingTimeWindow = function(groups) {
  var gmtAvailableHours = this.getGMTAvailableHoursForGroups(groups);
  var suggestedTimeSegment = getLongestContinuousSegment(gmtAvailableHours);
  var startHour = suggestedTimeSegment[0];
  var endHour = suggestedTimeSegment[suggestedTimeSegment.length - 1];
  return [startHour, endHour];
};

AppState.prototype.findMeetingTime = function() {

  this._state.meeting.groups.forEach(function(group) {
    group.hours = createHoursArrayForOffset(group.zoneHours);
  });

  var suggestedTimeWindow = this.getSuggestedMeetingTimeWindow(this._state.meeting.groups);
  var startHour = suggestedTimeWindow[0];
  var endHour = suggestedTimeWindow[1];

  if (!startHour && !endHour) {
    this._state.meeting.suggestedTime = null;
    return;
  }

  console.info(suggestedTimeWindow);

  // Get suggested local time
  var localZoneHours = moment().zone() / 60;
  var suggestedTime = timeUtils.formatLocalTimeWindow(startHour,
                                                      endHour,
                                                      localZoneHours,
                                                      this._state.timeFormat);

  this._state.meeting.suggestedTime = suggestedTime;

  // Get times for each zone
  this._state.meeting.groups.forEach(function(group) {
    group.suggestedTime = timeUtils.formatLocalTimeWindow(startHour,
                                                          endHour,
                                                          group.zoneHours,
                                                          this._state.timeFormat);
  }.bind(this));

};

AppState.prototype.clearMeetingGroups = function() {
  this._state.meeting = {
    people: []
  };
};
