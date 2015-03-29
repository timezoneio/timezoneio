/** @jsx React.DOM */

var React = require('react');
var moment = require('moment-timezone');
var Header = require('../components/header.jsx');
var timeUtils = require('../utils/time.js');

module.exports = React.createClass({

  getLocalTime: function() {
    var localTime = moment( this.props.time ).tz( this.props.user.tz );
    var fmtString = timeUtils.getFormatStringFor(this.props.timeFormat);
    return localTime.format(fmtString);
  },

  render: function() {
    var person = this.props.user;
    return (
      <div className="container profile-container">

        <Header />

        <div className="fw-section alt profile">
          <div className="content-container">

            <img src={person.avatar} className="avatar large profile-avatar"/>

            <div className="profile-details">
              <h2 className="profile-name">{person.name}</h2>
              <h3 className="profile-location">
                {person.location}
                <span className="profile-offset">{this.getLocalTime()}</span>
              </h3>
            </div>

          </div>
        </div>

      </div>
    );
  }
});