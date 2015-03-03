var timeUtils = module.exports = {};

// Get the time format string
timeUtils.getFormatStringFor = function(fmt) {
  return fmt === 24 ? 'H:mm' : 'h:mm a';
};

// Round to the closest quarter hour
timeUtils.roundToQuarterHour = function(minutes) {
  return Math.round(minutes / 60 * 4) * 15;
};