'use strict';
var React = require('react');
var classNames = require('classnames');
var moment = require('moment-timezone');
var timeUtils = require('../utils/time');

class ProfileLocation extends React.Component {

  getLocalTime() {
    if (!this.props.tz) return;
    var localTime = moment( this.props.time ).tz( this.props.tz );
    var fmtString = timeUtils.getFormatStringFor(this.props.timeFormat);
    return localTime.format(fmtString);
  }

  render() {

    var iconClasses = classNames('material-icons md-18 location-icon', {
      'loading': this.props.loading,
      'error': this.props.error
    });

    return (
      <p className="profile-location">
        <span className={iconClasses}>place</span>
        <span className={typeof this.props.onClick === 'function' && 'profile-location-clickable'}
              onClick={this.props.onClick}>
          {this.props.location}
        </span>
        <span className="profile-offset">
          {this.getLocalTime()}
        </span>
      </p>
    );
  }
}

module.exports = ProfileLocation;
