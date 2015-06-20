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

  var body = React.renderToString(
    React.createElement(App, {
      time: time,
      timezones: timezones,
      timeFormat: timeFormat,
      isCurrentTime: isCurrentTime
    })
  );

  var params = {
    title: strings.capFirst(req.params.name),
    body: body,
    script: 'bundles/app.js',
    data: {
      time: time,
      people: people,
      timeFormat: timeFormat,
      isCurrentTime: isCurrentTime
    }
  };

  render(req, res, params);

});

// Static files
app.use(express.static(__dirname + '/public'));

//process.env.PORT || 
app.listen(8080);
