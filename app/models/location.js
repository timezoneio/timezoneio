var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var locationSchema = new Schema({

  value: { type: String, default: '', trim: true },
  // "New City, NY, United States" - for display

  name: { type: String, default: '', trim: true },
  // "New City" - for search
  // store by lower case too?

  key: { type: String, default: '', trim: true },
  // "us:new-city:ny" - no current purpose

  commonZone: { type: String, default: '', trim: true },
  // "US" - no current purpose

  tz: { type: String, default: '', trim: true },
  // "America/New_York" ;)

  createdAt: { type : Date, default : Date.now },
  updatedAt: { type : Date, default : Date.now }

});


// Indexes
locationSchema.index({ name: 1 }); // for regex search


// Only return data the user needs
var PUBLIC_FIELDS = [
  'value',
  'name',
  'tz'
];

locationSchema.set('toJSON', {
  getters: true,
  virtuals: true,
  transform: function (doc, ret, options) {
    return PUBLIC_FIELDS.reduce(function(obj, field) {
      obj[field] = ret[field];
      return obj;
    }, {});
  }
});


locationSchema.statics = {

  findByQuery: function(query, done) {
    if (typeof query !== 'string')
      return done('Query must be a string');

    var regExp = new RegExp(query.toLowerCase(), 'i');

    LocationModel
      .find({ value: regExp })
      .limit(20)
      .exec(done);
  }

};


var LocationModel = module.exports = mongoose.model('Location', locationSchema);
