var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../actions/actionTypes');
var location = require('../helpers/location');
var api = require('../helpers/api');
var toolbelt = require('../utils/toolbelt');

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

  getUserLocationAndTimezone: function(user) {

    var positionData = toolbelt.pluck('location', 'tz', user);
    positionData.coords = toolbelt.clone(user.coords);

    return location.getCurrentPosition()
      .then(function(coords) {

        // If no current coords, dist is NaN
        var dist = location.calculateDistance(
          positionData.coords.lat, positionData.coords.long,
          coords.latitude, coords.longitude
        );

        // Check if the user has moved at least 10km
        if (!dist || dist > 10) {
          var newCoords = {
            lat: coords.latitude,
            long: coords.longitude
          };
          return Promise.all([
            newCoords,
            location.getCityFromCoords(newCoords),
            location.getTimezomeFromCoords(newCoords)
          ]);
        }

        return [positionData.coords, positionData.location, positionData.tz];
      })
      .then(function(values) {
        positionData.coords = values[0];
        positionData.location = values[1];
        positionData.tz = values[2];
        return positionData;
      })
      .catch(function(err) {
        console.error(err);
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
  },

  toggleSelectPerson: function(userId) {
    AppDispatcher.dispatchViewAction({
      actionType: ActionTypes.TOGGLE_SELECT_PERSON,
      value: userId
    });
  },

  clearMeetingGroups: function() {
    AppDispatcher.dispatchViewAction({
      actionType: ActionTypes.CLEAR_MEETING_GROUPS
    });
  }

};
