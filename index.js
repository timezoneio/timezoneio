var mongoose = require('mongoose');

var server = require('./lib/server.js');

mongoose.connect('mongodb://localhost/timezone');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  
  console.info('We\'re connected, great. Starting up the server...');
  server();

});
