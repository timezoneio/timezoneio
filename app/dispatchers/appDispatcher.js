var Dispatcher = require('flux').Dispatcher;

var AppDispatcher = new Dispatcher();
module.exports = AppDispatcher;

AppDispatcher.dispatchViewAction = function(action) {
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
};

AppDispatcher.dispatchApiAction = function(action) {
  this.dispatch({
    source: 'API_ACTION',
    action: action
  });
};

module.exports = AppDispatcher;
