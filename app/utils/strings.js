var strings = module.exports = {};

strings.capFirst = function(s) {
  if (!s.length) return s;
  return s[0].toUpperCase() + s.substr(1);
};

strings.isValidEmail = function(email) {
  var re = /.+@.+\..+/i;
  return re.test(email);
};

strings.pluralize = (items) => (items.length === 1 ? '' : 's');
