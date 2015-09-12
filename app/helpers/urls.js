var urlHelpers = module.exports = {};


urlHelpers.getProfileUrl = function(user) {
  return '/people/' + (user.username || user._id);
};
