var moment = require('moment-timezone');
var toolbelt = require('../utils/toolbelt');
var transform = require('../utils/transform');
var timeUtils = require('../utils/time');
var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../actions/actionTypes');


class AppState {

  constructor(initialState) {
    this._state = toolbelt.clone(window.appData);

    this._state.time = moment(this._state.time);
    this._state.meeting = {
      people: []
    };

    this.updateTimezones();
  }

  getState() {
    return this._state;
  }

  getCSRF() {
    return this._state.csrf_token;
  }

  getUser() {
    return this._state.user;
  }

  getTeam() {
    return this._state.team;
  }

  getPersonById(id) {
    return this._state.people.filter(function(p) { return p._id === id; })[0];
  }

  updateTimezones() {
    this._state.timezones = transform(this._state.time, this._state.people);
  }


  // Assumes time is not current :/
  setTime(timeMoment) {
    this._state.time = timeMoment;
    this._state.isCurrentTime = false;
  }

  updateToCurrentTime() {
    var now = moment();

    if (now.hour() === this._state.time.hour() &&
        now.minute() === this._state.time.minute())
      return;

    this._state.time.hour( now.hour() );
    this._state.time.minute( now.minute() );
    this._state.isCurrentTime = true;
  }

  setTimeFormat(format) {
    this._state.timeFormat = format;
  }

  getCurrentView() {
    return this._state.currentView;
  }

  setCurrentView(view) {
    this._state.currentView = view;
  }

  updateTeamData(data) {
    // Only update the team slug + name
    this._state.team.name = data.name;
    this._state.team.slug = data.slug;

    // NOTE - We're currently not re-slugifying
    if (this._state.team.url !== data.url) {
      this._state.team.url = data.url;

      // Trigger event to update the current url
      AppDispatcher.dispatchViewAction({
        actionType: ActionTypes.UPDATE_TEAM_URL,
        value: data.url
      });
    }
  }

  updateUserData(data) {
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
  }

  removeTeamMember(data) {
    var idx = this._state.people.map(function(p) { return p._id; })
                                .indexOf(data.usedId);
    if (idx > -1) {
      this._state.people.splice(idx, 1);
      this.updateTimezones();
    }
  }

  toggleSelectPerson(id) {
    var idx = this._state.meeting.people.map(function(p) { return p._id; })
                                        .indexOf(id);
    if (idx === -1)
      this._state.meeting.people.push(this.getPersonById(id));
    else
      this._state.meeting.people.splice(idx, 1);

    this.organizeMeetingGroups();
    this.findMeetingTime();
  }

  organizeMeetingGroups() {
    var zoneGroups = toolbelt.groupBy('utcOffset', this._state.meeting.people);

    this._state.meeting.groups = Object.keys(zoneGroups)
                                       .map(function(o) {
                                         var utcOffset = parseInt(o, 10);
                                         return {
                                           utcOffset: utcOffset,
                                           utcOffsetHours: utcOffset / 60,
                                           people: zoneGroups[utcOffset]
                                         };
                                       })
                                       .sort(function(a, b) {
                                         return b.utcOffset - a.utcOffset;
                                       });
  }

  getGMTAvailableHoursForGroups(groups, workStartHour, workEndHour) {
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

    // Get the suggested metting time in hours GMT
    var gmtAvailableHours = gmtHours.map(function(hour, idx) {
      return availableHoursIndexes[idx] ? hour : null;
    });

    return gmtAvailableHours;
  }

  getSuggestedMeetingTimeWindow(groups) {
    var gmtAvailableHours = this.getGMTAvailableHoursForGroups(groups);
    var suggestedTimeSegment = getLongestContinuousSegment(gmtAvailableHours);
    var startHour = suggestedTimeSegment[0];
    var endHour = suggestedTimeSegment[suggestedTimeSegment.length - 1];
    return [startHour, endHour];
  }

  findMeetingTime() {

    this._state.meeting.groups.forEach(function(group) {
      group.hours = createHoursArrayForOffset(group.utcOffsetHours);
    });

    var suggestedTimeWindow = this.getSuggestedMeetingTimeWindow(this._state.meeting.groups);
    var startHour = suggestedTimeWindow[0];
    var endHour = suggestedTimeWindow[1];

    if (!startHour && !endHour) {
      this._state.meeting.suggestedTime = null;
      return;
    }

    // Get suggested local time
    var localUtcHourOffset = moment().utcOffset() / 60;
    var suggestedTime = timeUtils.formatLocalTimeWindow(startHour,
                                                        endHour,
                                                        localUtcHourOffset,
                                                        this._state.timeFormat);

    this._state.meeting.suggestedTime = suggestedTime;

    // Get times for each zone
    this._state.meeting.groups.forEach(function(group) {
      group.suggestedTime = timeUtils.formatLocalTimeWindow(startHour,
                                                            endHour,
                                                            group.utcOffsetHours,
                                                            this._state.timeFormat);
    }.bind(this));
  }

  clearMeetingGroups() {
    this._state.meeting = {
      people: []
    };
  }

}

// Helper funcitons

var createHoursArray = function() {
  var hours = [];
  for (var i = 0; i < 24; i++) hours.push(i);
  return hours;
};

var createHoursArrayForOffset = function(utcOffsetHours) {
  var hours = createHoursArray();
  if (utcOffsetHours === 0)
    return hours;
  if (utcOffsetHours > 0) {
    var start = hours.splice(utcOffsetHours);
    return start.concat(hours);
  } else {
    var end = hours.splice(24 - Math.abs(utcOffsetHours));
    return end.concat(hours);
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

module.exports = AppState;
