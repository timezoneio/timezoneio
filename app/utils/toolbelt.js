var toolbelt = module.exports = {};

toolbelt.extend = function(object, data) {
  Object.keys(data).forEach(function(key) {
    object[key] = data[key];
  });
  return object;
};
