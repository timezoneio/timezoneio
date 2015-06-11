var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');
var api = require('../helpers/api.js');

var ActionCreators = module.exports = {

  saveUserInfo: function(userId, data) {
    return api
      .put('/api/user/' + userId, data)
      .then(function(data) {

        AppDispatcher.dispatchApiAction({
          actionType: ActionTypes.UPDATED_USER_DATA,
          value: data
        });

        return data;
      });
  },

  // Returns promise
  locationSearch: function(q) {
    return api
      .get('/api/location/search', { q: q })
      .then(function(data) {
        return data.results;
      });
  }

};
