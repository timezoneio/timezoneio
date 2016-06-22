var urlHelpers = module.exports = {};

urlHelpers.getUserHomepage = () => '/home';

urlHelpers.getProfileUrl = function(user) {
  return `/people/${(user.username || user._id)}`;
};
