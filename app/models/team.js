var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var TeamMember = require('./teamMember');
const BASE_URL = require('../helpers/baseUrl');
const ENV = require('../../env');


var teamSchema = new Schema({
  name: { type: String, default: '', trim: true, minlength: 1 },
  slug: { type: String, default: '', trim: true, minlength: 1 },

  inviteHash: { type: String, default: '', trim: true },

  //NOTE - I think this schema works w/ the nested array of objects
  admins: [{ type: Schema.ObjectId, ref: 'User' }],

  // DEPRECATED - User TeamMember instead
  // people: [{ type: Schema.ObjectId, ref: 'User' }],

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

// Populate the invite hash on first save
teamSchema.pre('save', function(next) {
  if (!this.inviteHash)
    this.inviteHash = crypto.createHash('md5')
                           .update(ENV.INVITE_SALT + this._id)
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
  'slug',
  'admins',
  'url',
  // We attach user objects as people
  'people',
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

  toSuperAdminJSON: function() {
    var json = this.toAdminJSON();
    json.createdAt = this.createdAt.toJSON();
    json.updatedAt = this.updatedAt.toJSON();
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

  getTeamMembers: function() {
    return TeamMember
      .find({ team: this._id })
      .populate('user')
      .then(function(teamMembers) {
        return teamMembers.map((tm) => tm.user).filter((user) => !!user);
      });
  },

  addTeamMember: function(user) {
    return TeamMember
      .findOrCreate(this._id, user._id)
      .then(function(teamMember) {
        return user;
      });
  },

  removeTeamMember: function(user) {
    return TeamMember.remove({ team: this._id, user: user._id }).exec();
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

  findOneWithTeamMembers: function(query) {
    return Team
      .findOne(query)
      .then(function(team) {
        if (!team)
          return null;
        return team
          .getTeamMembers()
          .then(function(users) {
            team.people = users;
            return team;
          });
      });
  },

  findAllForUserMenu: function(userId, done) {
    return TeamMember
      .findAllByUserId(userId)
      .limit(10)
      .populate({
        path: 'team',
        select: { name: 1, slug: 1 }
      })
      .then(function(teamMembers) {
        var teams = teamMembers
                      .map(function(tm) { return tm.team; })
                      .filter(function(team) { return !!team; });
        if (done) done(null, teams);
        return teams;
      });
  },

  findAllByUserId: function(userId, done) {
    return TeamMember
      .findAllByUserId(userId)
      .populate('team')
      .then(function(teamMembers) {
        var teams = teamMembers
                      .map(function(tm) { return tm.team; })
                      .filter(function(team) { return !!team; });
        if (done) done(null, teams);
        return teams;
      });
  },

  findAllByUser: function(user, done) {
    return this.findAllByUserId(user._id, done);
  },

  removeById: function(id) {
    return Promise
      .all([
        TeamMember.remove({ team: id }),
        this.remove({ _id: id })
      ]);
  }

};

var Team = module.exports = mongoose.model('Team', teamSchema);
