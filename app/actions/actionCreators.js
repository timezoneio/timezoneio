var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');
var api = require('../helpers/api.js');

var ActionCreators = module.exports = {

  saveUserInfo: function(userId, data) {
    return api
      .put('/user/' + userId, data)
      .then(function(data) {

        AppDispatcher.dispatchApiAction({
          actionType: ActionTypes.UPDATED_USER_DATA,
          value: data
        });

        return data;
      });
  },

  addNewTeamMember: function(data) {
    return api
      .post('/user', data)
      .then(function(data) {

        AppDispatcher.dispatchApiAction({
          actionType: ActionTypes.UPDATED_USER_DATA,
          value: data
        });

        return data;
      });
  },

  removeTeamMember: function(teamId, userId) {
    return api
      .delete('/team/' + teamId + '/member/' + userId)
      .then(function(data) {

        AppDispatcher.dispatchApiAction({
          actionType: ActionTypes.TEAM_MEMBER_REMOVED,
          value: data
        });

        return data;
      });
  },

  // Returns promise
  locationSearch: function(q) {
    return api
      .get('/location/search', { q: q })
      .then(function(data) {
        return data.results;
      });
  },

  getGravatar: function(email) {
    return api.get('/avatar/gravatar', { email: email })
      .then(function(data) {
        return data.avatar;
      });
  }

};
