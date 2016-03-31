
const VARS = [
  'NODE_ENV',
  'MONGO_URL',

  'EMAIL_HASH_SALT',
  'PASSWORD_RESET_TOKEN_SALT',
  'INVITE_SALT',

  'AWS_ACCESS_KEY',
  'AWS_SECRET_KEY',
  'S3_BUCKET',

  'TWITTER_KEY',
  'TWITTER_SECRET',

  'SLACK_CLIENT_ID',
  'SLACK_CLIENT_SECRET' ,

  'MANDRILL_KEY'
];

module.exports = VARS.reduce(function(obj, key) {
  obj[key] = process.env[key];
  return obj;
}, {
  // defaults
  NODE_ENV: 'development'
});
