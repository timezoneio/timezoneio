var auth = module.exports = {};


auth.login = function(req, res) {

  if (req.user) {
    return res.redirect('/people/' + req.user.username);
  }

  res.render('login', {
    errors: req.flash('error')
  });
};

auth.logout = function(req, res) {
  req.logout();
  res.redirect('/login');
};
