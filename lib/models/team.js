var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;


var teamSchema = new Schema({
  name: { type: String, default: '', trim: true },
  slug: { type: String, default: '', trim: true },

  //NOTE - I think this schema works w/ the nested array of objects
  admins: [{
    userId: { type: Schema.ObjectId, ref: 'User' }
  }],

  // people: [{
  //   id: { type: Schema.ObjectId, ref: 'User' }
  // }],

  createdAt: { type : Date, default : Date.now },
  updatedAt: { type : Date, default : Date.now }
});

// Indexes
teamSchema.index({ slug: 1 });

// TODO - slug validation
//      - admin required
//      - people validation/limitation

var Team = module.exports = mongoose.model('Team', teamSchema);
