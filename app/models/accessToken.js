var mongoose = require('mongoose');
var crypto = require('crypto');
const ENV = require('../../env.js');
var Schema = mongoose.Schema;


var accessTokenSchema = new Schema({
  token: { type: String, default: '' },
  user: { type: Schema.ObjectId, ref: 'User' },
  client: { type: Schema.ObjectId, ref: 'Client' },
  createdAt: { type: Date, default: Date.now }
});

// Indexes
accessTokenSchema.index({ token: 1 });

const API_TOKEN_VERSION = 1;
const SALT = ENV.API_TOKEN_SALT;
const createToken = function(clientId, userId) {
  return API_TOKEN_VERSION + '/' + crypto
    .createHmac('sha1', SALT + clientId)
    .update(userId)
    .digest('hex');
};

accessTokenSchema.methods = {

  createToken: function() {
    return this.token = createToken(this.client.toString(), this.user.toString());
  }

};


const AccessToken = module.exports = mongoose.model('AccessToken', accessTokenSchema);
