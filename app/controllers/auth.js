var UserModel = require('../models/user');
var TeamModel = require('../models/team');
var sendEmail = require('../email/send');
var redis = require('redis');
var redisClient = require('../helpers/redis');
var sendEmail = require('../email/send');
var isValidEmail = require('../utils/strings').isValidEmail;
var getProfileUrl = require('../helpers/urls').getProfileUrl;

var auth = module.exports = {};

auth.login = function(req, res) {

  if (req.user)
    return res.redirect( getProfileUrl(req.user) );

  res.render('login', {
    errors: req.flash('error'),
    noScript: true
  });
};

auth.signup = function(req, res) {

  if (req.user)
    return res.redirect( getProfileUrl(req.user) );

  res.render('signup', {
    errors: req.flash('error'),
    welcomeBack: req.query.welcome == 'back',
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

  // Let's loosen up for now!
  // if (!/\d/.test(p1))
  //   return 'Passwords must contain a number';

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

  // The invite hash may be in post body or the session
  var inviteCode = req.body.inviteCode || function() {
    var code = req.flash('inviteCode');
    return code && code[0];
  }();

  var pwError = getPasswordValidationError(req.body.password, req.body.password2);
  if (pwError) {
    req.flash('inviteCode', inviteCode);
    return renderError(pwError);
  }

  UserModel.findOneByEmail(req.body.email)
    .then(function(user) {
      if (user && user.isRegistered)
        return Promise.reject('A user with that email already exists, please login instead');

      // If the user is not found, but there is an invite hash, that means
      // the user changed their email during signup
      if (!user && inviteCode) {
        var userId = inviteCode.split(/-/)[0];
        var emailHash = inviteCode.split(/-/)[1];
        return UserModel
          .findOne({ _id: userId })
          .then(function(user) {
            if (!user || emailHash !== user.getEmailHash())
              return Promise.reject('Sorry, please retry the invite link from your email ;)');
            return user;
          });
      }

      // This may be an existing unregistered user or undefined
      return user;
    })
    .then(function(user) {
      var newUser = null;

      // Update the existing unregistered user or create a new one
      if (user) {
        newUser = user;
        newUser.email = req.body.email;
        newUser.password = req.body.password;
      } else {
        newUser = new UserModel({
          email: req.body.email,
          password: req.body.password
        });
      }

      newUser.save(function(err) {
        if (err)
          return renderError(err); // 'Something didn\'t work right there, can you try again?'

        // this is async
        sendEmail('welcome', newUser.email);
          // .then(null, function(err){ ...mark user email invalid })
          // TODO - handle bounced and error'd emails!

        // login the user manually
        req.logIn(newUser, function(err) {
          if (err)
            return renderError('Sorry, We weren\'t able to log you in! ');

          var next = req.flash('next');
          if (next && next[0]) {
            req.flash('next', '/get-started');
            res.redirect(next[0]);
          } else {
            res.redirect('/get-started');
          }
        });
      });
    }, function(err) {
      renderError(err.message ||
                  'Something didn\'t work right there, can you try again?');
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

  var userId = req.params.userId;
  var emailHash = req.params.emailHash;

  TeamModel.findOne({ inviteHash: req.params.inviteHash })
    .then(function(team) {
      if (!team)
        return invalidHashResponse();

      // If the user is logged in, just add them to the team!
      if (req.user) {
        team.addTeamMember(req.user);
        return team.save(function(err) {
          var next = req.flash('next');
          next = (next && next[0]) || team.url;
          res.redirect(next);
        });
      }

      req.flash('next'); // clear it
      req.flash('next', req.url);

      // If no userId, it's a generic invite url
      if (!userId)
        return res.render('signup', {
          title: `Join ${team.name} on Timezone.io!`,
          teamInvite: true,
          team: team,
          noScript: true
        });

      UserModel.findOne({ _id: userId })
          .then(function(user) {
            if (!user || user.getEmailHash() !== emailHash)
              return invalidHashResponse();

            // Invite code is the user id + the email hash
            req.flash('inviteCode'); // clear it
            req.flash('inviteCode', `${user._id}-${emailHash}`);

            return res.render('signup', {
              title: `Join ${team.name} on Timezone.io!`,
              email: user.email,
              teamInvite: true,
              team: team,
              noScript: true,
            });
          }, function(err) {
            invalidHashResponse();
          });
    }, function(err) {
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

auth.passwordResetRequestForm = function(req, res) {
  if (req.user)
    return res.redirect(req.user.getProfileUrl());

  res.render('PasswordReset', {
    title: 'Reset your password',
    requestReset: true,
    noScript: true
  });
};

auth.passwordResetRequest = function(req, res, next) {

  if (req.user)
    return res.redirect(req.user.getProfileUrl());

  UserModel
    .findOneByEmail(req.body.email)
    .then(function(user) {

      if (!user)
        return res.render('PasswordReset', {
          title: 'Reset your password',
          requestReset: true,
          errors: 'We couldn\'t find an account with that email, please try again!',
          noScript: true
        });

      // create temp token
      var key = user.getPasswordResetKey();
      var token = user.createPasswordResetToken();
      redisClient.set(key, token, redis.print);
      redisClient.expire(key, 60 * 60); // expire in 1 hour

      const BASE_URL = require('../helpers/baseUrl');
      var url = `${BASE_URL}/account/password-reset?userId=${user._id}&resetToken=${token}`;

      // Send the user their reset email
      sendEmail('passwordReset', user.email, {
        name: user.name,
        resetUrl: url
      });

      res.render('PasswordReset', {
        title: 'Reset your password',
        requestReset: true,
        success: true,
        noScript: true
      });

    }, function() {
      next();
    });

};

// Middlware
auth.verifyPasswordResetToken = function(req, res, next) {

  if (req.user)
    return res.redirect(req.user.getProfileUrl());

  var userId = req.query.userId;
  var resetToken = req.query.resetToken;

  var invalidUrlResponse = function() {
    res.render('PasswordReset', {
      title: 'Reset your password',
      hideForm: true,
      errors: 'Sorry, that url seems to be invalid or may have expired after 60 minutes. ' +
              'Please try to grab the link from your email again ;)',
      noScript: true
    });
  };

  if (!userId || !resetToken)
    return invalidUrlResponse();

  UserModel
    .findOneById(userId)
    .then(function(user) {
      if (!user)
        return invalidUrlResponse();

      var key = user.getPasswordResetKey();
      redisClient.get(key, function(err, token) {
        if (err) return next();

        if (!token || token !== resetToken)
          return invalidUrlResponse();

        // We're valid, move along!
        req.user = user;
        next();
      });
    }, function() {
      invalidUrlResponse();
    });
};

auth.passwordResetForm = function(req, res) {
  res.render('PasswordReset', {
    title: 'Reset your password',
    noScript: true
  });
};

auth.passwordReset = function(req, res) {

  var pwError = getPasswordValidationError(req.body.password, req.body.password2);
  if (pwError) {
    return res.render('PasswordReset', {
      title: 'Reset your password',
      errors: pwError,
      noScript: true
    });
  }

  // req.user is added in verifyPasswordResetToken middleware above
  req.user.password = req.body.password;

  req.user.save(function(err) {
    if (err)
      return res.render('PasswordReset', {
        title: 'Reset your password',
        errors: 'Sorry, We weren\'t able to reset your password at this time, please try again',
        noScript: true
      });


      req.logIn(req.user, function(err) {
        if (err)
          return res.render('PasswordReset', {
            title: 'Reset your password',
            errors: [ 'Sorry, We weren\'t able to log you in!', err.message],
            noScript: true
          });

        // Disable the password reset key immediately
        redisClient.del(req.query.resetToken);

        req.flash('message', 'Awesome, your new password is set and you\'re ready to go!');

        res.redirect(req.user.getProfileUrl());
      });
  });

};
