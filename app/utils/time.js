var moment = require('moment-timezone');

var timeUtils = module.exports = {};

// Get the time format string
timeUtils.getFormatStringFor = function(fmt) {
  return fmt === 24 ? 'H:mm' : 'h:mm a';
};

// Get the time preferred format sans minutes
timeUtils.getShortFormatStringFor = function(fmt) {
  return fmt === 24 ? 'H' : 'h'; // ha
};

// Get the hour in the format desired
timeUtils.getHourFormattedString = function(hour, fmt) {
  if (fmt === 24)
    return hour + ':00';
  var m = hour < 12 ? 'am' : 'pm';
  if (hour === 0)
    hour = 12;
  if (hour > 12)
    hour = hour - 12;
  return hour + m;
};

timeUtils.gmtHoursToOffset = function(gmtHour, utcHourOffset) {
  var hour = gmtHour + utcHourOffset;
  if (hour >= 24) hour -= 24;
  return hour >= 0 ? hour : 24 + hour;
};

timeUtils.formatLocalTimeWindow = function(startHour, endHour, utcHourOffset, fmt) {
  var localStartHour = timeUtils.gmtHoursToOffset(startHour, utcHourOffset);
  var localEndHour = timeUtils.gmtHoursToOffset(endHour, utcHourOffset);

  if (localStartHour === localEndHour)
    return timeUtils.getHourFormattedString(localStartHour, fmt);

  return timeUtils.getHourFormattedString(localStartHour, fmt) +
         ' - ' +
         timeUtils.getHourFormattedString(localEndHour, fmt);
};

// Round to the closest quarter hour
timeUtils.roundToQuarterHour = function(minutes) {
  return Math.round(minutes / 60 * 4) * 15;
};

timeUtils.getHoursAsArray = function(start) {
  start = start || 0;
  var hours = [];
  for (var hour = start; hour < (24 + start); hour++) {
    hours.push(hour >= 24 ? hour - 24 : hour);
  }
  return hours;
};

timeUtils.getAvailableHoursInUTC = function(tz, formatString) {
  var hours = timeUtils.getHoursAsArray(9);
  var local = moment()
    .tz('UTC')
    .hours(0)
    .minutes(0)
    .tz(tz);

  return hours.map(function(hour) {
    var localNow = moment(local).add(hour, 'h');
    var localHour = localNow.hour();
    var isAvailable = localHour >= 9 && localHour < 17; // 9 to 5
    return {
      hour: hour,
      localHour: localHour,
      localTime: localNow.format(formatString),
      isAvailable: isAvailable
    };
  });
};
