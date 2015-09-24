var moment = require('moment-timezone');

var UserModel = require('../models/user.js');
var TeamModel = require('../models/team.js');
var transform = require('../../app/utils/transform.js');
var strings = require('../../app/utils/strings.js');


var team = module.exports = {};

team.index = function(req, res, next) {
  var slug = req.params.name;
  var VALID_VIEWS = ['manage'];
  var DEFAULT_VIEW = 'app';
  var view = VALID_VIEWS.indexOf(req.params.view) > -1 ? req.params.view : DEFAULT_VIEW;

  TeamModel
    .findOne({ slug: slug })
    .populate('people')
    .then(function(team) {
      // Team not found
      if (!team) return next();

      var isAdmin = team.isAdmin(req.user);

      // Organize into timezones
      var time = moment();
      var timezones = transform(time, team.people);
      var timeFormat = 12; // hardcode default for now

      var people = !isAdmin ?
                    team.people :
                    team.people.map(function(u) { return u.toAdminJSON(); });

      res.render('team', {
        title: strings.capFirst(team.name || ''),
        people: people,
        isAdmin: isAdmin,
        time: time,
        team: isAdmin ? team.toAdminJSON() : team,
        timezones: timezones,
        timeFormat: timeFormat,
        isCurrentTime: true,
        currentView: isAdmin ? view : DEFAULT_VIEW,
        // justCreated: true // DEBUG
        justCreated: req.flash('justCreated')[0] === true
      });


    }, next); // error

};

team.createForm = function(req, res, next) {

  if (!req.user)
    return res.redirect('/login');

  res.render('createTeam', {
    title: 'Create your team',
    errors: req.flash('error')
  });
};

team.create = function(req, res, next) {

  if (!req.body.name) {
    req.flash('error', 'Please provide a name');
    return res.redirect('/team');
  }

  var searchSlug = TeamModel.slugify(req.body.name);

  // Match the bare slug or the slug followed by a dash and digit
  var reggie = new RegExp(searchSlug + '$|' + searchSlug + '-(\\d+)$');

  // Run a query to figure out what to use as the slug
  TeamModel.find({ slug: reggie }, function(err, teams) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/team');
    }

    var getSlug = function(teamNames, num, baseSlug) {
      var slug = num ? baseSlug + '-' + num : baseSlug;
      var exists = ~teamNames.indexOf(slug);
      return exists ? getSlug(teamNames, ++num, baseSlug) : slug;
    };
    var numTeams = teams.length;
    var teamNames = teams.map(function(t) { return t.name; });
    var slug = getSlug(teamNames, numTeams, searchSlug);

    var newTeam = new TeamModel({
      name: req.body.name,
      slug: slug
    });

    newTeam.addAdmin(req.user);
    newTeam.addTeamMember(req.user);

    newTeam.save(function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/team');
      }

      // SUCCESS!!
      req.flash('justCreated', true);
      res.redirect(newTeam.getManageUrl());

    });

  });

};
