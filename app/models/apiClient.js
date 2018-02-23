var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;


var apiClientSchema = new Schema({
  name: { type: String, default: '' },
  user: { type: Schema.ObjectId, ref: 'User' },
  secret: { type: String, default: '' },
  redirectURI: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

var APIClient = module.exports = mongoose.model('APIClient', apiClientSchema);

apiClientSchema.set('toJSON', {
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.secret
    return ret
  }
})
