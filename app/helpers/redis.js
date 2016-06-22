var redis = require('redis');

var client = redis.createClient({
  host: process.env.NODE_ENV === 'production' ? '127.0.0.1' : 'redis',
});

// This is a simple wrapper so we can re-use the active redis connection

client.on('error', function (err) {
  console.log('Error ' + err);
});

module.exports = client;
