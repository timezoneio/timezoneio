var mongoose = require('mongoose');

var server = require('./app/server.js');

var MAX_RETRIES = 100;
var retries = -1;

var env = process.env.NODE_ENV;
var isProduction = env === 'production';

// In production 'db' is added to the hosts file during linking
var auth = 'prod:[WexeYHJcqXjxA3;gT.8';
// var dbHost = isProduction ?
//               auth + '@' + process.env.DB_PORT_27017_TCP_ADDR :
//               'localhost';
var dbHost = 'localhost';

var connect = function () {
  if (retries >= MAX_RETRIES)
    return console.info('Couldn\'t connect to the database');

  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect('mongodb://' + dbHost + '/timezone', options);

  retries++;
};
connect();

mongoose.connection.on('error', console.error);
mongoose.connection.on('disconnected', connect);
mongoose.connection.once('open', function (callback) {

  console.info('We\'re connected, booyah! Starting up the server...');
  server();

});
