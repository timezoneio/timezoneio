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
      isOpen: false,
      isSliderActive: false
    };

    this.closeMenu = this.closeMenu.bind(this); // for binding/unbinding
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.closeMenu);
  }

  openMenu() {
    this.setState({ isOpen: true });
    window.addEventListener('click', this.closeMenu);
  }

  closeMenu() {
    this.setState({ isOpen: false });
    window.removeEventListener('click', this.closeMenu);
  }

  handleClickMenu(e) {
    e.stopPropagation();
  }

  handleClickTime(e) {
    e.stopPropagation();
    this.state.isOpen ? this.closeMenu() : this.openMenu();
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

  handleSliderMove() {
    this.setState({ isSliderActive: true });
  }

  handleSliderStop() {
    this.setState({ isSliderActive: false });
  }

  render() {

    var classes = classNames('time-control', {
      'time-control-open': this.state.isOpen
    });

    var menuClasses = classNames('time-control-menu', {
      'time-control-menu-slider-only': this.state.isOpen && this.state.isSliderActive
    });

    return (
      <div className={classes}>

        <h2 className="time-control-time"
            onClick={this.handleClickTime.bind(this)}>
          <Time timeFormat={this.props.timeFormat}
                time={this.props.time} />
        </h2>

        <div className={menuClasses}
             onClick={this.handleClickMenu}>

          <TimeSlider time={this.props.time}
                      isCurrentTime={this.props.isCurrentTime}
                      handleSliderMove={this.handleSliderMove.bind(this)}
                      handleSliderStop={this.handleSliderStop.bind(this)} />

          <div className="time-control-buttons app-sidebar--button-row">

            <div className="button-group app-sidebar--format-select">
              <button className={'small hollow ' + (this.props.timeFormat === 12 ? 'selected' : '')}
                      onClick={this.handleFormatChange.bind(null, 12)}>12</button>
              <button className={'small hollow ' + (this.props.timeFormat === 24 ? 'selected' : '')}
                      onClick={this.handleFormatChange.bind(null, 24)}>24</button>
            </div>

            <button className="small hollow"
                    disabled={this.props.isCurrentTime ? 'disabled' : ''}
                    onClick={this.handleGotoCurrentTime}>Now</button>
          </div>

        </div>

      </div>
    );
  }
}

module.exports = TimeControl;
