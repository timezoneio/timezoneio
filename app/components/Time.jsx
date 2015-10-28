'use strict';
var React = require('react');
var timeUtils = require('../utils/time.js');

class Time extends React.Component {
  render() {
    var formatString = timeUtils.getFormatStringFor(this.props.timeFormat);
    var displayTime = this.props.time.format(formatString);
    return <span>{displayTime}</span>;
  }
}

module.exports = Time;
