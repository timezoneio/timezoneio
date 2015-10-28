var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');


module.exports = React.createClass({

  displayName: 'TimeSlider',

  getInitialState: function() {
    return {
      value: 50,
      isCurrentTime: this.props.isCurrentTime
    };
  },

  handleChange: function(value) {
    value = +value;
    var percentDelta = 2 * (value - 50) / 100;

    this.setState({
      value: value,
      isCurrentTime: value === 50
    });

    // NOTE - This may need to be throttled
    AppDispatcher.dispatchViewAction({
      actionType: ActionTypes.ADJUST_TIME_DISPLAY,
      value: percentDelta
    });

    if (typeof this.props.handleSliderMove === 'function')
      this.props.handleSliderMove();

    // debounce
    this.detectStopMoving();
  },

  handleStopMoving: function() {
    if (typeof this.props.handleSliderStop === 'function')
      this.props.handleSliderStop();
    window.removeEventListener('mouseup', this.handleStopMoving);
    this.mouseUpListener = false;
  },

  // Should listen to mouse up
  detectStopMoving: function() {
    // if (this.stopTimeoutId)
    //   clearTimeout(this.stopTimeoutId);
    // this.stopTimeoutId = setTimeout(this.handleStopMoving, 100);
    if (this.mouseUpListener)
      return;
    this.mouseUpListener = true;
    window.addEventListener('mouseup', this.handleStopMoving);
  },

  handleBlur: function(e) {
    this.handleStopMoving();
    window.removeEventListener('mouseup', this.handleStopMoving);
    this.mouseUpListener = false;
  },

  render: function() {

    var valueLink = {
      value: this.props.isCurrentTime ? 50 : this.state.value,
      requestChange: this.handleChange
    };

    return (
      <div className="time-slider-container">
        <input type="range"
               className="time-slider"
               valueLink={valueLink}
               onBlur={this.handleBlur} />
      </div>
    );
  }

});
