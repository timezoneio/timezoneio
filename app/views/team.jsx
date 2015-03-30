/** @jsx React.DOM */

var React = require('react');
var AppSidebar = require('../components/appSidebar.jsx');
var TimezoneList = require('../components/timezoneList.jsx');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="container app-container">

        <AppSidebar time={this.props.time} 
                    timeFormat={this.props.timeFormat}
                    isCurrentTime={this.props.isCurrentTime} />

        <TimezoneList time={this.props.time}
                      timeFormat={this.props.timeFormat}
                      timezones={this.props.timezones} />

      </div>
    );
  }
});