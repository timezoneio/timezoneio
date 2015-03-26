var strings = module.exports = {};

strings.capFirst = function(s) {
  if (!s.length) return s;
  return s[0].toUpperCase() + s.substr(1);
};