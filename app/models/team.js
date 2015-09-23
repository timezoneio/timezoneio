var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;


var teamSchema = new Schema({
  name: { type: String, default: '', trim: true },
  slug: { type: String, default: '', trim: true },

  inviteHash: { type: String, default: '', trim: true },

  //NOTE - I think this schema works w/ the nested array of objects
  admins: [{ type: Schema.ObjectId, ref: 'User' }],
  people: [{ type: Schema.ObjectId, ref: 'User' }],

  createdAt: { type : Date, default : Date.now },
  updatedAt: { type : Date, default : Date.now }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});


// Indexes
teamSchema.index({ slug: 1 });
teamSchema.index({ people: 1 });

const INVITE_SALT = '***REMOVED***';
const BASE_URL = process.env.NODE_ENV === 'production' ?
                 'http://timezone.io' :
                 'http://localhost:8080';

// Populate the invite hash on first save
teamSchema.pre('save', function(next) {
  if (!this.inviteHash)
    this.inviteHash = crypto.createHash('md5')
                           .update(INVITE_SALT + this._id)
                           .digest('hex')
                           .substr(0, 16); // only need 16 characters
  next();
});

teamSchema
  .virtual('url')
  .get(function() { return '/team/' + this.slug; });


var PUBLIC_FIELDS = [
  '_id',
  'name',
  'admins',
  'people',
  'url'
];

teamSchema.set('toJSON', {
  getters: true,
  virtuals: true,
  transform: function (doc, ret, options) {
    return PUBLIC_FIELDS.reduce(function(obj, field) {
      obj[field] = ret[field];
      return obj;
    }, {});
  }
});

// TODO - slug validation
//      - admin required
//      - people validation/limitation

teamSchema.methods = {

  toAdminJSON: function() {
    var json = this.toJSON();
    json.inviteUrl = this.getInviteUrl();
    return json;
  },

  getManageUrl: function() {
    return this.url + '/manage';
  },

  getInviteUrl: function(user) {
    var url = `${BASE_URL}/join/${this.inviteHash}`;
    if (user)
      return `${url}/${user._id}-${user.getEmailHash()}`;
    return url;
  },

  isAdmin: function(user) {
    return !!user && !!this.admins.filter(function(adminId) {
      return adminId.toString() === user._id.toString();
    }).length;
  },

  addAdmin: function(user) {
    if (!~this.admins.indexOf(user._id.toString()))
      this.admins.push(user);
    return true;
  },

  removeAdmin: function(user) {
    var idx = this.admins.indexOf(user._id.toString());
    if (idx > -1)
      this.admins.splice(idx, 1);
    return true;
  },

  addTeamMember: function(user) {
    if (!~this.people.indexOf(user._id.toString()))
      this.people.push(user);
    return true;
  },

  removeTeamMember: function(user) {
    var idx = this.people.indexOf(user._id.toString());
    if (idx > -1)
      this.people.splice(idx, 1);
    return true;
  },

};

teamSchema.statics = {

  slugify: function(name) {
    return name.toString().toLowerCase()
              .replace(/\s+/g, '-')           // Replace spaces with -
              .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
              .replace(/\-\-+/g, '-')         // Replace multiple - with single -
              .replace(/^-+/, '')             // Trim - from start of text
              .replace(/-+$/, '');            // Trim - from end of text
  },

  findInfoByIds: function(teamIds, done) {
    return Team.find({ _id: { $in: teamIds } }, 'name slug', done);
  },

  findAllByUser: function(user, done) {
    return Team.find({ people: user._id }, done);
  }

};

var Team = module.exports = mongoose.model('Team', teamSchema);
