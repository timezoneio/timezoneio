'use strict';
var React = require('react');
var classNames = require('classnames');
var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../actions/actionTypes');
var Time = require('./Time');
var TimeSlider = require('./timeSlider');

class TimeControl extends React.Component {

  constructor(props) {
    super(props);

    this.state =  {
      isOpen: false
    };
  }

  handleToggleConsole(e) {
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleFormatChange(value, e) {
    AppDispatcher.dispatchViewAction({
      actionType: ActionTypes.CHANGE_TIME_FORMAT,
      value: value
    });
  }

  handleGotoCurrentTime(e) {
    AppDispatcher.dispatchViewAction({
      actionType: ActionTypes.USE_CURRENT_TIME
    });
  }

  render() {

    var classes = classNames('time-control', {
      'time-control-open': this.state.isOpen
    });

    var sliderContainerClasses = classNames('time-control-slider-container', {
      'is-hidden': !this.state.isOpen
    });

    var toggleIcon = this.state.isOpen ? 'chevron_left' : 'chevron_right';

    return (
      <div className={classes}>

        <h2 className="time-control-time"
            onClick={this.handleToggleConsole.bind(this)}>
          <Time timeFormat={this.props.timeFormat}
                time={this.props.time} />
        </h2>

        <button
          className="time-control-toggle clear material-icons"
          onClick={this.handleToggleConsole.bind(this)}>
          {toggleIcon}
        </button>

        <div className={sliderContainerClasses}>

          <TimeSlider
            time={this.props.time}
            isCurrentTime={this.props.isCurrentTime}
          />

          <button
            className="time-control-now small hollow"
            disabled={this.props.isCurrentTime ? 'disabled' : ''}
            onClick={this.handleGotoCurrentTime}>
            Now
          </button>

        </div>

      </div>
    );
  }
}

module.exports = TimeControl;
