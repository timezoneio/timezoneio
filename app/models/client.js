var mongoose = require('mongoose')
var Schema = mongoose.Schema


var clientSchema = new Schema({
  name: { type: String, default: '' },
  user: { type: Schema.ObjectId, ref: 'User' },
  secret: { type: String, default: '' },
  redirectURI: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
})

var Client = module.exports = mongoose.model('Client', clientSchema)

clientSchema.set('toJSON', {
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.secret
    return ret
  }
})
