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

  console.info('We\'re connected, booyah! Starting up the server...');
  server();

});

// var UserModal = require('./app/models/user.js');

// UserModal.findOne({ username: 'dan' }, function(err, user) {

//   console.info( user.authenticate('password') ? 'OK!' : 'NO' );

// });
