/** @jsx React.DOM */

var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      value: 50,
      isCurrentTime: this.props.isCurrentTime
    };
  },
  handleChange: function(value) {
    value = +value;
    var percentDelta = (100 - value) / 100;

    this.setState({
      value: value,
      isCurrentTime: value === 50
    });

    // NOTE - This may need to be throttled
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.ADJUST_TIME_DISPLAY,
      value: percentDelta
    });
  },
  render: function() {

    var valueLink = {
      value: this.props.isCurrentTime ? 50 : this.state.value,
      requestChange: this.handleChange
    };

    return <div className="time-slider-container">
      <input type="range" 
             className="time-slider"
             valueLink={valueLink} />
    </div>;
  }
});