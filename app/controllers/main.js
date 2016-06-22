var moment = require('moment');

var main = module.exports = {};

main.index = function(req, res) {
  res.render('homepage');
};

main.about = function(req, res) {
  res.render('about');
};

main.roadmap = function(req, res) {
  res.render('roadmap');
};

main.contact = function(req, res) {
  res.render('Contact');
};

main.home = function(req, res) {
  res.render('Home', {
    title: 'Home',
    teams: req.user.teams,
    time: moment(),
    timeFormat: req.user.getUserSetting('timeFormat'),
    message: req.flash('message'),
    errors: req.flash('error')
  });
};
