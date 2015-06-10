var api = require('../helpers/api.js');

var ActionCreators = module.exports = {

  // Returns promise
  locationSearch: function(q) {

    return api.get('/api/location/search', { q: q })
              .then(function(data) {
                return data.results;
              });
  }

};
