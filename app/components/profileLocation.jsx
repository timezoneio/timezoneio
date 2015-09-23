'use strict';

var React = require('react');
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

    var iconClasses = 'material-icons md-18 location-icon';
    if (this.props.loading) iconClasses += ' loading';

    return (
      <p className="profile-location">
        <span className={iconClasses}>place</span>
        {this.props.location}
        <span className="profile-offset">
          {this.getLocalTime()}
        </span>
      </p>
    );
  }
}

module.exports = ProfileLocation;
