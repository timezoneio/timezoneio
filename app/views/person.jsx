var React = require('react');
var moment = require('moment-timezone');
var Header = require('../components/header.jsx');
var timeUtils = require('../utils/time.js');

module.exports = React.createClass({

  displayName: 'PersonView',

  getLocalTime: function() {
    var localTime = moment( this.props.time ).tz( this.props.profileUser.tz );
    var fmtString = timeUtils.getFormatStringFor(this.props.timeFormat);
    return localTime.format(fmtString);
  },

  render: function() {
    var profileUser = this.props.profileUser;
    return (
      <div className="container profile-container">

        <Header {...this.props} />

        <div className="fw-section alt profile">
          <div className="content-container">

            <img src={profileUser.avatar} className="avatar large profile-avatar"/>

            <div className="profile-details">
              <h2 className="profile-name">{profileUser.name}</h2>
              <h3 className="profile-location">
                {profileUser.location}
                <span className="profile-offset">
                  {this.getLocalTime()}
                </span>
              </h3>
              <p>
                {this.props.teams.map(function(team, idx) {
                  return (
                    <a key={idx}
                       href={team.url}>
                      {team.name}
                    </a>
                  )
                })}
              </p>
            </div>

          </div>
        </div>

      </div>
    );
  }
});
