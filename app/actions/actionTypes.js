var keyMirror = require('keymirror');

module.exports = keyMirror({

  // View actions
  CHANGE_TIME_FORMAT: 0,
  ADJUST_TIME_DISPLAY: 0,
  USE_CURRENT_TIME: 0,

  SHOW_MODAL: 0,
  CLOSE_MODAL: 0,

  SAVE_TEAM_INFO: 0,

  // API actions
  UPDATED_USER_DATA: 0,
  TEAM_MEMBER_REMOVED: 0

});
