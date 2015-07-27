var data = require('./data.js');

var async = require('async');
var mongoose = require('mongoose');
var LocationModel = require('./app/models/location.js');

// IMPORT THE TIMEZONE DATA
// NOTE - may want to drop collection inbetween runs

var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect('mongodb://localhost/timezone', options);
};
connect();

mongoose.connection.on('error', console.error);
mongoose.connection.on('disconnected', function() {
  console.info('Goodbye');
});
mongoose.connection.once('open', function () {

  console.info('We\'re connected - Importing the data');

  var tzmap = data.tzmap;
  var selectables = data.selectables;

  /* ex
  {
    c:"US", // "Common zones"
    d:"New City, NY, United States", // value to show
    k:"us:new-city:ny", // key
    n:"New City", // name (for searching)
    T:"city lmt new ny states united", // tokens ??? - not imported now
    z:324
  }
  */
  async.eachSeries(selectables, function(s, callback) {

    LocationModel.findOne({ value: s.d }, function(err, location) {

      // no dupes
      if (location) return callback();

        var l = new LocationModel({
          value: s.d,
          name: s.n,
          key: s.k,
          commonZone: s.C,
          tz: tzmap[s.z]
        });

        console.info('saving %s', s.d);

        l.save(callback);
    });

  }, function done() {
    console.info('%d locations imported', selectables.length);
    mongoose.disconnect();
  });

});
