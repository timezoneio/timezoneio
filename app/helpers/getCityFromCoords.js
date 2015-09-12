
// SERVER ONLY

var geocoder = require('geocoder');

module.exports = function getCityFromCoords(lat, long, cb) {

  geocoder.reverseGeocode(lat, long, function(err, data) {
    if (err) return cb(err);
    if (!data.results || !data.results.length) return cb('No results!');

    // TODO - clean this up:
    var city = null;
    // var country = null;
    // NOTE - city is "administrative_area_level_1"
    for (var i = 0; i < data.results.length; i++) {
      data.results[i].address_components.forEach(function(comp) {
        if (!city && comp.types.indexOf('locality') >= 0)
          city = comp.long_name;
        // if (!country && comp.types.indexOf('country') >= 0) country = comp.long_name;
      });

      if (city)
        return cb(null, city);
    }

    cb('No location found!');
  });

};
