
// SERVER ONLY

var qs = require('querystring');
var request = require('request');

var base = 'https://maps.googleapis.com/maps/api/timezone/json?';

// NOTE - this has a max of 2,500 calls per day for free
module.exports = function getTimezoneFromLocation(lat, long, cb) {

  var params = {
    key: process.env.GOOGLE_MAPS_API_KEY,
    location: lat + ',' + long,
    timestamp: Math.floor(new Date().valueOf() / 1000)
  };

  request.get(base + qs.stringify(params), function(err, res, body) {
    var tz = body && JSON.parse(body).timeZoneId;
    cb(err, tz);
  });

};
