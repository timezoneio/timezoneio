var qs = require('querystring');
var request = require('request');

var SERVER_KEY = 'AIzaSyCx6SyF4wrwAQy_oVFqzTMOgOzx5jfoOpk';
var base = 'https://maps.googleapis.com/maps/api/timezone/json?';

// NOTE - this has a max of 2,500 calls per day for free
module.exports = function getTimezoneFromLocation(lat, long, cb) {

  var params = {
    key: SERVER_KEY,
    location: lat + ',' + long,
    timestamp: Math.floor(new Date().valueOf() / 1000)
  };

  request.get(base + qs.stringify(params), function(err, res, body) {
    var tz = body && JSON.parse(body).timeZoneId;
    cb(err, tz);
  });

};
