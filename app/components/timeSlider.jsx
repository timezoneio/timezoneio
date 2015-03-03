/** @jsx React.DOM */

var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');

module.exports = React.createClass({
  handleChange: function(e) {
    var percentDelta = (100 - e.target.value) / 100;

    // NOTE - This may need to be throttled
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.ADJUST_TIME_DISPLAY,
      value: percentDelta
    });
  },
  render: function() {
    return <div className="time-slider-container">
      <input type="range" 
             className="time-slider"
             onChange={this.handleChange} />
    </div>;
  }
});