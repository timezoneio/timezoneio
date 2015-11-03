
var account = module.exports = {};

account.index = function(req, res) {

  res.render('Account', {
    errors: req.flash('error'),
    title: 'Account',
    userSettings: req.user.getAllUserSettings()
  });

};
