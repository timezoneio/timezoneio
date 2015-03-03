var time = module.exports = {};

// Get the time format string
time.getFormatStringFor = function(fmt) {
  return fmt === 24 ? 'H:mm' : 'h:mm a';
};