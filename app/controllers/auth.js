var UserModel = require('../models/user');
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
  res.render('signup', {
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
          res.redirect('/get-started');
        });
      });
    })
    .catch(function(err) {
      return renderError('Something didn\'t work right there, can you try again?');
    });

};

auth.logout = function(req, res) {
  req.logout();
  res.redirect('/login');
};

auth.connectTwitter = function(req, res) {
  res.redirect(getProfileUrl(req.user));
};
