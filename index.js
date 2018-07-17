var mongoose = require('mongoose');
var redisClient = require('./app/helpers/redis');
var server = require('./app/server.js');
const ENV = require('./env.js');

var MAX_RETRIES = 100;
var retries = -1;

var env = process.env.NODE_ENV;
const isProduction = env === 'production';

var MONGO_URL = ENV.MONGO_URL || 'mongodb://db:27017/timezone';
const MONGO_CONNECTION_OPTIONS = {
  autoIndex: !isProduction,
  useNewUrlParser: true,
}

var connect = function () {
  if (retries >= MAX_RETRIES)
    return console.info('Couldn\'t connect to the database');
  mongoose.connect(MONGO_URL, MONGO_CONNECTION_OPTIONS);
  retries++;
};
connect();


mongoose.connection.on('error', console.error);
mongoose.connection.on('disconnected', connect);
mongoose.connection.once('open', function (callback) {

  console.info('We\'re connected, booyah! Starting up the server...');
  server(mongoose.connection, redisClient);

});
