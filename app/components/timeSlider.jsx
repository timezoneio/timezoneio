var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');

class TimeSlider extends React.Component {

  construtor() {
    this.state = {
      value: 50,
      isCurrentTime: this.props.isCurrentTime
    };
  }

  handleChange(value) {
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
  }

  render() {

    var valueLink = {
      value: this.props.isCurrentTime ? 50 : this.state.value,
      requestChange: this.handleChange
    };

    return (
      <div className="time-slider-container">
        <input
          type="range"
          className="time-slider"
          valueLink={valueLink}
        />
      </div>
    );
  }

}

module.exports = TimeSlider
