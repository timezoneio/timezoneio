var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;


var teamSchema = new Schema({
  name: { type: String, default: '', trim: true },
  slug: { type: String, default: '', trim: true },

  //NOTE - I think this schema works w/ the nested array of objects
  admins: [{ type: Schema.ObjectId, ref: 'User' }],

  // people: [{
  //   id: { type: Schema.ObjectId, ref: 'User' }
  // }],

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

teamSchema
  .virtual('url')
  .get(function() { return '/team/' + this.slug; });

// TODO - slug validation
//      - admin required
//      - people validation/limitation

teamSchema.methods = {

  isAdmin: function(user) {
    return !!user && !!this.admins.filter(function(adminId) {
      return adminId.toString() === user._id.toString();
    }).length;
  },

  addAdmin: function(user) {
    // NOTE - Should we check if this user is already an admin?
    this.admins.push(user);
    return true;
  }

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
    Team.find({ _id: { $in: teamIds } }, 'name slug', done);
  }

};

var Team = module.exports = mongoose.model('Team', teamSchema);
