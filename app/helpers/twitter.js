const Twitter = require('twitter');
const UserModel = require('../models/user');
const ENV = require('../../env.js');

function getTwitterClient(authData) {
  return new Twitter({
    consumer_key: ENV.TWITTER_KEY,
    consumer_secret: ENV.TWITTER_SECRET,
    access_token_key: authData.token,
    access_token_secret: authData.tokenSecret
  });
}

function getTwitterTokens(twitterData) {
  return new Promise(function(resolve, reject) {
    if (twitterData.token && twitterData.tokenSecret) {
      return resolve({
        token: twitterData.token,
        tokenSecret: twitterData.tokenSecret
      });
    }

    // An account w/ a valid twitter token
    UserModel.findOneById('5513998f6d1aacc66f7e7eff')
      .then(function(user) {
        resolve({
          token: user.twitter.token,
          tokenSecret: user.twitter.tokenSecret
        });
      })
      .catch(reject);
  });
}

module.exports.getTwitterAvatar = function(twitterData) {
  const twitterUserId = twitterData.id;
  return getTwitterTokens(twitterData)
    .then(function(authData) {
      const t = getTwitterClient(authData);
      return t.get('users/show', { user_id: twitterUserId })
        .then(function(twitterUser) {
          return twitterUser.profile_image_url_https;
        });
    });
};
