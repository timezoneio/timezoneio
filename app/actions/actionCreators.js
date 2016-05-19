var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../actions/actionTypes');
var location = require('../helpers/location');
var api = require('../helpers/api');
const getUserHomepage = require('../helpers/urls').getUserHomepage;
var toolbelt = require('../utils/toolbelt');

var ActionCreators = module.exports = {

  saveTeamInfo: function(teamId, data) {
    return api
      .put('/team/' + teamId, data)
      .then(function(data) {

        AppDispatcher.dispatchApiAction({
          actionType: ActionTypes.UPDATED_TEAM_DATA,
          value: data
        });

        return data;
      });
  },

  deleteTeam: function(teamId) {
    return api
      .delete('/team/' + teamId)
      .then(function(res) {
        // Redirect to user profile
        window.location = getUserHomepage();
      });
  },

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

  saveUserSetting: function(userId, name, value) {
    return api
      .put('/user/' + userId + '/setting', {
        name: name,
        value: value
      })
      .then(function(data) {
        // No op for now
        return data;
      });
  },

  getUserByEmail: function(email, teamId) {
    return api.get('/user',{ email: email, teamId: teamId });
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

  addTeamMember: function(teamId, userId) {
    return api
      .post(`/team/${teamId}/member`, { userId: userId })
      .then(function(data) {

        AppDispatcher.dispatchApiAction({
          actionType: ActionTypes.UPDATED_USER_DATA,
          value: data.user
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
    positionData.coords = toolbelt.clone(user.coords || {});

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
            location.getTimezoneFromCoords(newCoords)
          ]);
        }

        return [positionData.coords, positionData.location, positionData.tz];
      })
      .then(function(values) {
        positionData.coords = values[0];
        positionData.location = values[1];
        positionData.tz = values[2];
        return positionData;
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

  searchTeam: function(term) {
    AppDispatcher.dispatchViewAction({
      actionType: ActionTypes.SEARCH_TEAM,
      value: term
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
