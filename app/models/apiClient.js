const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;


const apiClientSchema = new Schema({
  name: { type: String, default: '', unique: true, required: true },
  secret: { type: String, required: true },
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

apiClientSchema.methods = {

  generateSecret: function() {
    this.secret = crypto.randomBytes(20).toString('hex');
  }

};

const Client = module.exports = mongoose.model('Client', apiClientSchema);
