var keyMirror = require('keymirror');

module.exports = keyMirror({

  // View actions
  CHANGE_TIME_FORMAT: 0,
  ADJUST_TIME_DISPLAY: 0,
  USE_CURRENT_TIME: 0,
  TOGGLE_SELECT_PERSON: 0,
  CLEAR_MEETING_GROUPS: 0,
  SEARCH_TEAM: 0,
  CHANGE_GROUP_BY: 0,

  SHOW_VIEW: 0,
  CLOSE_VIEW: 0,

  // State actions
  UPDATE_TEAM_URL: 0,

  // API actions
  UPDATED_TEAM_DATA: 0,
  UPDATED_USER_DATA: 0,
  TEAM_MEMBER_REMOVED: 0

});
