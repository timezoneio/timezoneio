var Dispatcher = require('flux').Dispatcher;

var AppDispatcher = new Dispatcher();
module.exports = AppDispatcher;

AppDispatcher.handleViewAction = function(action) {
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
};

AppDispatcher.handleApiAction = function(action) {
  this.dispatch({
    source: 'API_ACTION',
    action: action
  });
};

module.exports = AppDispatcher;
