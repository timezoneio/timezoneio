'use strict';
var UserModel = require('../models/user');

var account = module.exports = {};

account.index = function(req, res) {

  res.render('Account', {
    message: req.flash('message'),
    errors: req.flash('error'),
    title: 'Account',
    userSettings: req.user.getAllUserSettings()
  });

};

account.saveAccountInfo = function(req, res) {

  for (var key in req.body) {
    if (UserModel.ADMIN_WRITABLE_FIELDS.indexOf(key) > -1) {
      req.user[key] = req.body[key];
    }
  }

  if (req.body.settings) {
    for (let name in req.body.settings) {
      req.user.setUserSetting(name, req.body.settings[name]);
    }
  }

  req.user.save(function(err) {
    if (err)
      req.flash('error', 'We couldn\'t save your changes, please try again -' + err.message);
    else
      req.flash('message', 'All your changes have been saved. Sweet.');

    res.redirect('/account');
  });




};
