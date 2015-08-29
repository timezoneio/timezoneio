// General migration script
var mongoose = require('mongoose');

var MAX_RETRIES = 100;
var retries = -1;

var env = process.env.NODE_ENV;
var isProduction = env === 'production';

// In production 'db' is added to the hosts file during linking
var auth = 'prod:[WexeYHJcqXjxA3;gT.8';
var dbHost = 'localhost';

// The main export is a function to connect with the database
module.exports = function(callback) {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect('mongodb://' + dbHost + '/timezone', options);

  mongoose.connection.on('error', console.error);
  mongoose.connection.on('disconnected', function() {
    console.log('Connection closed. Migration complete.');
  });
  mongoose.connection.once('open', function () {
    console.log('Connected to database. Starting migration:');
    callback(null, mongoose.connection);
  });

};
