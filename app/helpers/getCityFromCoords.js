
// SERVER ONLY

var geocoder = require('geocoder');

module.exports = function getCityFromCoords(lat, long, cb) {

  geocoder.reverseGeocode(lat, long, function(err, data) {
    if (err) return cb(err);
    if (!data.results || !data.results.length) return cb('No results!');

    // NOTE - city is "administrative_area_level_1", town is "locality"
    var cities = data.results
      .map(function(result) {

        // Find the component that is classified as a 'locality'
        var cityComponent = result.address_components.filter(function(component) {
          return component.types.indexOf('locality') >= 0;
        })[0];

        return cityComponent && cityComponent.long_name;
      })
      .filter(function(city) {
        return  !!city;
      });

    if (cities[0])
      return cb(null, cities[0]);

    cb('No location found!');
  });

};
