var redis = require('redis');

const options = {}

if (process.env.NODE_ENV === 'production') {
  options.url = process.env.REDIS_URL
} else {
  options.host = 'redis'
}

const client = redis.createClient(options)

// This is a simple wrapper so we can re-use the active redis connection

client.on('error', function (err) {
  console.log('Error ' + err);
});

module.exports = client;
