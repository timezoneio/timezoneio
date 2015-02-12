var strings = module.exports;

strings.capFirst = function(s) {
  return s[0].toUpperCase() + s.substr(1);
};