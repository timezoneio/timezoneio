var mongoose = require('mongoose');

var server = require('./app/server.js');

var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect('mongodb://localhost/timezone', options);
};
connect();

mongoose.connection.on('error', console.error);
mongoose.connection.on('disconnected', connect);
mongoose.connection.once('open', function (callback) {
  
  console.info('We\'re connected, great. Starting up the server...');
  server();

});

