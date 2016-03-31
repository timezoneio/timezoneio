var moment = require('moment-timezone');

var UserModel = require('../models/user.js');
var TeamModel = require('../models/team.js');
var TeamMemberModel = require('../models/teamMember.js');
var transform = require('../../app/utils/transform.js');
var strings = require('../../app/utils/strings.js');


var team = module.exports = {};

team.index = function(req, res, next) {
  var slug = req.params.name;
  var VALID_VIEWS = ['manage'];
  var DEFAULT_VIEW = 'app';
  var view = VALID_VIEWS.indexOf(req.params.view) > -1 ? req.params.view : DEFAULT_VIEW;

  TeamModel
    .findOneWithTeamMembers({ slug: slug })
    .then(function(team) {
      // Team not found
      if (!team) return next();

      var isAdmin = team.isAdmin(req.user) ||
                    team.isAdmin(res.locals.impersonateUser);
      var isTeamMember = req.user &&
                         !!team.people.filter((u) => u.equals(req.user) ).length;

      var toJSONMethod = isAdmin ? 'toAdminJSON' :
                         isTeamMember ? 'toTeamJSON' :
                         'toJSON';

      // Ensure we're exposing the right data
      team.people = team.people.map(function(u) { return u[toJSONMethod](); });

      // Organize into timezones
      var time = moment();
      var timezones = transform(time, team.people);
      var timeFormat = req.user ?
                       req.user.getUserSetting('timeFormat') :
                       UserModel.getDefaultSettingValue('timeFormat');

      res.render('team', {
        title: strings.capFirst(team.name || ''),
        people: team.people,
        isAdmin: isAdmin,
        time: time,
        team: isAdmin ? team.toAdminJSON() : team,
        timezones: timezones,
        timeFormat: timeFormat,
        isCurrentTime: true,
        currentView: isAdmin ? view : DEFAULT_VIEW,
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

  // If user decides to create a team with the same name:
  var createSameName = req.body.createSameName === 'true';

  function getNewTeamSlug(name) {
    // If not, we'll go search to find any matching slugs to create a new one!
    var searchSlug = TeamModel.slugify(name);

    // Match the bare slug or the slug followed by a dash and digit
    var reggie = new RegExp(searchSlug + '$|' + searchSlug + '-(\\d+)$');
    // Run a query to figure out what to use as the slug
    return TeamModel
      .find({ slug: reggie })
      .then(function(teams) {
        var getSlug = function(teamNames, num, baseSlug) {
          var slug = num ? baseSlug + '-' + num : baseSlug;
          var exists = ~teamNames.indexOf(slug);
          return exists ? getSlug(teamNames, ++num, baseSlug) : slug;
        };
        var numTeams = teams.length;
        var teamNames = teams.map(function(t) { return t.name; });
        var slug = getSlug(teamNames, numTeams, searchSlug);
        return slug;
      });
  }

  function getPotentialDuplicateTeams(name) {
    var reggie = new RegExp(name.trim(), 'i');
    return TeamModel
      .find({ name: reggie })
      .populate('admins');
  }

  function createTeam(name, slug) {
    var newTeam = new TeamModel({
      name: name,
      slug: slug
    });

    newTeam.addAdmin(req.user);

    return Promise
      .all([
        newTeam.save(),
        newTeam.addTeamMember(req.user)
      ])
      .then(function(values) {
        // We're only interested in the team right for now for createTeamSuccess
        return values[0];
      });
  }

  function createTeamSuccess(team) {
    req.flash('justCreated', true);
    res.redirect(team.getManageUrl());
  }

  function handleCreateError(err) {
    req.flash('error', err.message);
    res.redirect('/team');
  }

  // What query should we run?
  if (createSameName) {
    getNewTeamSlug(req.body.name)
      .then(createTeam.bind(null, req.body.name))
      .then(createTeamSuccess, handleCreateError);

  } else {
    getPotentialDuplicateTeams(req.body.name)
      .then(function(existingTeams) {

        if (existingTeams.length)
          return res.render('createTeam', {
            title: 'Create your team',
            name: req.body.name,
            existingTeams: existingTeams
          });

        return getNewTeamSlug(req.body.name)
          .then(createTeam.bind(null, req.body.name))
          .then(createTeamSuccess);
          // NOTE - Do we need another handler here since the last one doesn't
          // return a promise?
      }, handleCreateError);
  }

};
