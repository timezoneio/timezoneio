var UserModel = require('../models/user');
var TeamModel = require('../models/team');
var isValidEmail = require('../utils/strings').isValidEmail;
var getProfileUrl = require('../helpers/urls').getProfileUrl;

var auth = module.exports = {};

auth.login = function(req, res) {

  if (req.user)
    return res.redirect( getProfileUrl(req.user) );

  res.render('login', {
    errors: req.flash('error'),
    noScript: true,
    next: req.query.next
  });
};

auth.signup = function(req, res) {

  if (req.user)
    return res.redirect( getProfileUrl(req.user) );

  res.render('signup', {
    errors: req.flash('error'),
    noScript: true
  });
};


var getPasswordValidationError = function(p1, p2) {
  if (!p1 || !p2)
    return 'Sorry, passwords cannot be blank';

  if (p1 !== p2)
    return 'Sorry, the two passwords did not match';

  if (p1.length < 8)
    return 'Passwords must be at least 8 characters';

  if (!/\d/.test(p1))
    return 'Passwords must contain a number';

  return null;
};

auth.create = function(req, res) {

  var renderError = function(err) {
    res.render('signup', {
      errors: [err],
      email: req.body.email
    });
  };

  if (!isValidEmail(req.body.email))
    return renderError('Please provide a valid email address');

  UserModel.findOneByEmail(req.body.email)
    .then(function(user) {
      if (user)
        return renderError('A user with that email already exists, please login instead');

      var pwError = getPasswordValidationError(req.body.password, req.body.password2);
      if (pwError)
        return renderError(pwError);

      var newUser = new UserModel({
        email: req.body.email,
        password: req.body.password
      });

      newUser.save(function(err) {
        if (err)
          return renderError(err); // 'Something didn\'t work right there, can you try again?'

        // login the user manually
        req.logIn(newUser, function(err) {
          if (err)
            return renderError('Sorry, We weren\'t able to log you in! ');

          var next = req.flash('next');
          if (next) {
            req.flash('next', '/get-started');
            res.redirect(next);
          } else {
            res.redirect('/get-started');
          }
        });
      });
    })
    .catch(function(err) {
      return renderError('Something didn\'t work right there, can you try again?');
    });

};

auth.joinTeam = function(req, res) {

  var invalidHashResponse = function() {
    req.flash('error', 'Sorry, that invite url isn\'t valid :(');
    res.redirect('/signup');
  };

  if (req.params.inviteHash.length !== 16) {
    return invalidHashResponse();
  }

  TeamModel.findOne({ inviteHash: req.params.inviteHash })
    .then(function(team) {
      if (!team)
        return invalidHashResponse();

      // If the user is logged in, just add them to the team!
      if (req.user) {
        team.addTeamMember(req.user);
        return team.save(function(err) {
          var next = req.flash('next') || team.url;
          res.redirect(next);
        });
      }

      req.flash('next', req.url);

      res.render('signup', {
        teamInvite: true,
        team: team,
        noScript: true
      });
    })
    .catch(function(err) {
      return invalidHashResponse();
    });
};

auth.logout = function(req, res) {
  req.logout();
  res.redirect('/login');
};

auth.connectTwitter = function(req, res) {
  res.redirect(getProfileUrl(req.user));
};
