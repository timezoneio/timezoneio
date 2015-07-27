var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;


var apiAuthSchema = new Schema({
  token: { type: String, default: '' },
  user: { type: Schema.ObjectId, ref: 'User' },
  client: { type: Schema.ObjectId, ref: 'Client' },
  createdAt: { type : Date, default : Date.now }
});

// Indexes
apiAuthSchema.index({ token: 1 });

var API_TOKEN_VERSION = 1;
var SALT = 'BODHI';
var createToken = function(clientId, userId) {
  return API_TOKEN_VERSION + '/' + crypto
    .createHmac('sha1', SALT + clientId)
    .update(userId)
    .digest('hex');
};

apiAuthSchema.methods = {

  createToken: function() {
    this.token = createToken(this.client.toString(), this.user.toString());
  }

};


var APIAuth = module.exports = mongoose.model('APIAuth', apiAuthSchema);
