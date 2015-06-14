var toolbelt = module.exports = {};

toolbelt.extend = function(object, data) {
  Object.keys(data).forEach(function(key) {
    object[key] = data[key];
  });
  return object;
};

// For indexOf nested objects, ex.
//   toolbelt.indexOf({ isCool: true }, [{ isCool: true }, { isCool: false }])
//   => 0
toolbelt.indexOf = function(query, arr) {
  var key = typeof query === 'object' ? Object.keys(query)[0] : query;
  var value = typeof query === 'object' ? query[key] : true;

  for (var i = 0, len = arr.length; i < len; i++) {
    if (arr[i][key] === value)
      return i;
  }

  return -1;
};
