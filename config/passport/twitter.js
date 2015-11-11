var TwitterStrategy = require('passport-twitter').Strategy;
var UserModel = require('../../app/models/user');

const CALLBACK_URL = process.env.NODE_ENV === 'production' ?
                     'http://timezone.io/connect/twitter/callback' :
                     'http://localhost:8080/connect/twitter/callback';

module.exports = new TwitterStrategy({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: CALLBACK_URL,
    passReqToCallback: true
  },
  function(req, token, tokenSecret, profile, done) {
    var options = {
      criteria: { 'twitter.id': profile.id }
    };

    var updateAvatar = !!req.flash('use_avatar');

    // We only save part of this data
    var twitterProfileData = [
      'id', 'screen_name', 'name', 'description', 'location',
      'profile_image_url', 'profile_image_url_https'
    ].reduce(function(data, key) {
      data[key] = profile._json[key];
      return data;
    }, {});

    UserModel.findOne({ 'twitter.id': twitterProfileData.id })
      .then(function(user) {

        // Add data to user profile + save
        if (!user && req.user) {
          req.user.twitter = twitterProfileData;
          if (updateAvatar) req.user.useAvatar('twitter');
          return req.user.save(function(err) {
            done(err, req.user);
          });
        }

        // TODO - create user + login
        if (!user && !req.user) {
          return done(null, false, { message: 'Twitter oauth not current supported' });
        }

        // TODO - login user
        if (user && !req.user) {
          return done(null, false, { message: 'Twitter login not current supported' });
        }

        if (user && req.user) {
          if (req.user._id.toString() !== user._id.toString()) {
            return done(null, false, {
              message: 'You already have another Timezone.io account, please log out then log in via Twitter'
            });
          }

          // Update fresh profile data
          req.user.twitter = twitterProfileData;
          if (updateAvatar) req.user.useAvatar('twitter');
          return req.user.save(function(err) {
            done(err, req.user);
          });
        }

        done('Error connecting to Twitter');
      }, function(err) {
        done(err);
      });
  }
);
