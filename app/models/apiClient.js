var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;


var apiClientSchema = new Schema({
  name: { type: String, default: '' },
  user: { type: Schema.ObjectId, ref: 'User' },
  createdAt: { type : Date, default : Date.now }
});

var APIClient = module.exports = mongoose.model('APIClient', apiClientSchema);
