if (typeof Promise === 'undefined') require('es6-promise').polyfill();
var api = require('./api');

var toRad = function(n) {
  return n * Math.PI / 180;
};

var location = module.exports = {};

// Returns Promise
location.getCurrentPosition = function() {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(function(position) {
      resolve(position.coords);
    }, function(err) {
      reject(err);
    });
  });
};

// Returns Promise
location.getCityFromCoords = function(coords) {
  return api
    .get('/location/city', coords)
    .then(function(data) {
      return data.city;
    });
};

location.getTimezoneFromCoords = function(coords) {
  return api
    .get('/location/timezone', coords)
    .then(function(data) {
      return data.tz;
    });
};

// Get the distance in kilometers between two sets of coordinates
// Returns integer
location.calculateDistance = function(lat1, long1, lat2, long2) {
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLong = toRad(long2-long1);
  var lat1Rad = toRad(lat1);
  var lat2Rad = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLong/2) * Math.sin(dLong/2) *
          Math.cos(lat1Rad) * Math.cos(lat2Rad);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};
