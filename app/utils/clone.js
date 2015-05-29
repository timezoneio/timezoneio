module.exports = function clone(source) {
  if (source === null || typeof source !== 'object') {
    return source;
  }

  var obj = source.constructor();
  var keys = Object.keys(source);
  var l = keys.length;
  for (var i = 0; i < l; i++) {
    var key = keys[i];
    obj[key] = clone(source[key]);
  }

  return obj;
};
