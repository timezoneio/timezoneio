const mongoose = require('mongoose')
const uuid = require('uuid/v4')
const Schema = mongoose.Schema

const authorizationCodeSchema = new Schema({
  code: { type: String, default: uuid },
  user: { type: Schema.ObjectId, ref: 'User' },
  client: { type: Schema.ObjectId, ref: 'Client' },
  redirectURI: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now, expires: 60 }
})

authorizationCodeSchema.index({ code: 1 })

const AuthorizationCode = mongoose.model('AuthorizationCode', authorizationCodeSchema)

module.exports = AuthorizationCode
