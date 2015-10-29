var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var userSettings = require('./sub/userSettings')
var isValidEmail = require('../utils/strings').isValidEmail;

// Inspiration: https://github.com/madhums/node-express-mongoose-demo/blob/master/app/models/user.js


var userSchema = new Schema({
  username: { type: String, default: '' },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  provider: { type: String, default: '' },
  hashedPassword: { type: String, default: '' },
  salt: { type: String, default: '' },
  inviteCode: { type: String, default: '' }, // ???

  // loginProvider: { type: String, default null },
  // facebook: {},
  twitter: {},
  // google: {},

  avatar: { type: String, default: '' },
  // Add GPS coords for smart location updating
  coords: {
    lat: { type: Number },
    long: { type: Number }
  },
  location: { type: String, default: '' },
  tz: { type: String, default: '' },

  settings: [userSettings.schema],

  createdAt: { type : Date, default : Date.now },
  updatedAt: { type : Date, default : Date.now }
});


// Indexes
userSchema.index({ username: 1 });

const SUPER_ADMIN_ID = '5513998f6d1aacc66f7e7eff';

// Keep these configs closer to the ones in static
var PUBLIC_FIELDS = [
  '_id',
  'username',
  'name',
  'avatar',
  'location',
  'tz',
  'isRegistered'
];

var OWNER_FIELDS = [
  'coords',
  'email'
];

const EMAIL_HASH_SALT = '***REMOVED***';
const PASSWORD_RESET_TOKEN_SALT = '***REMOVED***';

// See toOwnerJSON below
userSchema.set('toJSON', {
  getters: true,
  virtuals: true,
  transform: function (doc, ret, options) {
    return PUBLIC_FIELDS.reduce(function(obj, field) {
      obj[field] = ret[field];
      return obj;
    }, {});
  }
});

//TODO username validation as slug

userSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._password; });

// NOTE - This should be updated to check valid loginProvider for oauth logins
userSchema
  .virtual('isRegistered')
  .get(function() { return !!this.hashedPassword; });

userSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password) &&
      !this.skipValidation() &&
      !this.isEmptyUser()) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
});


var validatePresenceOf = function (value) {
  return value && value.length;
};

// the below 5 validations only apply if you are signing up traditionally

userSchema.path('email').validate(function (email) {
  if (this.skipValidation()) return true;
  return email.length;
}, 'Email cannot be blank');

userSchema.path('email').validate(function (email) {
  if (this.skipValidation()) return true;
  return isValidEmail(email);
}, 'Email must be valid');

userSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User');
  if (this.skipValidation()) fn(true);

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0);
    });
  } else fn(true);
}, 'Email already exists');

// NOTE - Disabled name + username requirements for signup flow,
// maybe can check "onboarded" boolean in future
userSchema.path('name').validate(function (name) {
  return true;
  // if (this.skipValidation()) return true;
  // return name.length;
}, 'Name cannot be blank');

userSchema.path('username').validate(function (username) {
  return true;
  // if (this.skipValidation() || this.isEmptyUser()) return true;
  // return username.length;
}, 'Username cannot be blank');

userSchema.path('username').validate(function (username, fn) {
  var User = mongoose.model('User');
  if (this.skipValidation() || this.isEmptyUser())
    return fn(true);

  if (!username)
    return fn(true);

  // Check only when it is a new user or when username field is modified
  if (this.isNew || this.isModified('username')) {
    User.find({ username: username }).exec(function (err, users) {
      fn(!err && users.length === 0);
    });
  } else fn(true);
}, 'Username already exists');

userSchema.path('hashedPassword').validate(function (hashedPassword) {
  if (this.skipValidation() || this.isEmptyUser()) return true;
  return hashedPassword.length;
}, 'Password cannot be blank');


userSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  /**
   * Validation is not required if using OAuth
   */

  skipValidation: function() {
    return false;
    // return ~oAuthTypes.indexOf(this.provider);
  },

  // Used for team invite emails and verifying user's identity
  getEmailHash: function() {
    return crypto.createHash('md5')
                 .update(EMAIL_HASH_SALT + this.email)
                 .digest('hex')
                 .substr(0, 16);
  },

  getPasswordResetKey: function() {
    return 'password_reset_' + this._id.toString();
  },

  createPasswordResetToken: function() {
    return crypto.createHash('md5')
                 .update(PASSWORD_RESET_TOKEN_SALT + this._id.toString() + Date.now())
                 .digest('hex');
  },

  isSuperAdmin: function() {
    return this._id.toString() === SUPER_ADMIN_ID;
  },

  isEmptyUser: function() {
    return !this.hashedPassword;
  },

  toAdminJSON: function() {
    var json = this.toJSON();
    json.email = this.email;
    return json;
  },

  toSuperAdminJSON: function() {
    var json = this.toAdminJSON();
    json.createdAt = this.createdAt.toJSON();
    json.updatedAt = this.updatedAt.toJSON();
    return json;
  },

  // NOTE - this needs to be recursively turned into JSON acceptable objects?
  toOwnerJSON: function() {
    var json = this.toJSON();
    OWNER_FIELDS.forEach(function(field) {
      json[field] = this[field];
    }.bind(this));
    if (this.teams) {
      json.teams = this.teams.map(function(t){ return t.toJSON(); });
    }
    return json;
  },

  isOnTeam: function(team) {
    return !!team && !!this.teams.filter(function(t) {
      return t.toString() === team._id.toString();
    }).length;
  },

  addToTeam: function(team) {
    if (!team) return false;
    this.teams.push(team);
    return true;
  },

  removeFromTeam: function(team) {
    if (!team) return false;

    this.teams = this.teams.filter(function(teamId) {
      return teamId.toString() !== team._id.toString();
    });
    return true;
  },

  useAvatar: function(provider) {
    if (!this[provider])
      return false;
    if (provider === 'twitter')
      this.avatar = this.twitter.profile_image_url_https.replace('_normal', '_200x200');
    return true;
  },

  getUserSetting: function(settingName) {
    return userSettings.getSettingValue(settingName, this.settings);
  },

  getUserSettingDoc: function(settingName) {
    return userSettings.getSettingDoc(settingName, this.settings);
  },

  setUserSetting: function(settingName, value) {
    return userSettings.setSettingValue(settingName, value, this.settings);
  }

};

var WRITABLE_FIELDS = [
  'name',
  'avatar',
  'coords',
  'location',
  'tz'
];

userSchema.statics = {

  WRITABLE_FIELDS: WRITABLE_FIELDS,

  ADMIN_WRITABLE_FIELDS: WRITABLE_FIELDS.concat([
    'email'
  ]),

  getDefaultSettingValue: function(type) {
    return userSettings.getDefaultSettingValue(type);
  },

  findOneByUsername: function(username, done) {
    return User.findOne({ username: username }, done);
  },

  findOneById: function(id, done) {
    return this.findOne({ _id: id }, done);
  },

  findOneByUsernameOrId: function(usernameOrId, done) {

    // ObjectId must be 24 characters long
    if (usernameOrId.toString().length === 24)
      return User.findOne({
        $or: [{ username: usernameOrId }, { _id: usernameOrId }]
      }, done);

    return this.findOneByUsername(usernameOrId, done);
  },

  findOneByEmail: function(email, done) {
    return User.findOne({ email: email }, done);
  },

  findAllRegistered: function(done) {
    return User.find({ hashedPassword: { $ne: '' } }, done);
  }

};


var User = module.exports = mongoose.model('User', userSchema);
