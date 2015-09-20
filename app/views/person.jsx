var React = require('react');
var moment = require('moment-timezone');
var Header = require('../components/header.jsx');
var timeUtils = require('../utils/time.js');
var DEFAULT_AVATAR = require('../helpers/images').DEFAULT_AVATAR;

// TEMP FOR TESTING
var s3 = require('../helpers/s3');

module.exports = React.createClass({

  displayName: 'PersonView',

  getInitialState: function() {
    return  {
      avatar: null
    };
  },

  getLocalTime: function() {
    if (!this.props.profileUser.tz) return;
    var localTime = moment( this.props.time ).tz( this.props.profileUser.tz );
    var fmtString = timeUtils.getFormatStringFor(this.props.timeFormat);
    return localTime.format(fmtString);
  },

  isOwnProfile: function() {
    return this.props.user._id === this.props.profileUser._id;
  },

  getFileExtension: function(file) {
    var matches = /\.\w+$/.exec(file.name);
    return matches && matches[0];
  },

  generateAvatarFilename: function(file) {
    return 'avatar/' + this.props.profileUser._id + this.getFileExtension(file);
  },

  handleFileChange: function(e) {
    var files = e.target.files;
    var file = files[0];

    // TODO - https://www.npmjs.com/package/crop-rotate-resize-in-browser
    if (file) {
      s3.uploadFile(file, this.generateAvatarFilename(file))
        .then(function(fileUrl) {
          this.setState({ avatar: fileUrl });
        }.bind(this));
    } else {
      console.warn('No file added');
    }

  },

  render: function() {
    var profileUser = this.props.profileUser;
    return (
      <div className="container">

        <Header {...this.props} />

        <div className="profile">
          <div className="profile-main">

            <img src={profileUser.avatar || this.state.avatar || DEFAULT_AVATAR}
                 className="avatar large profile-avatar" />

            <div className="profile-details">
              <h2 className="profile-name">{profileUser.name}</h2>
              <p className="profile-location">
                <span className="material-icons md-18 brand location-icon">place</span>
                {profileUser.location}
                <span className="profile-offset">
                  {this.getLocalTime()}
                </span>
              </p>
              <div className="profile-teams">
                {this.props.teams.map(function(team, idx) {
                  return (
                    <a key={idx}
                       href={team.url}
                       className="button profile-team">
                      {team.name}
                    </a>
                  )
                })}
              </div>
            </div>

          </div>

            { this.isOwnProfile() &&
              <div>
                 <a href="/connect/twitter?use_avatar=true"
                    className="button twitter">
                    Use Twitter Profile Photo
                 </a>
              </div>
            }

        </div>

      </div>
    );
  }
});

/*
<input type="text" name="avatar" />
<input type="file"
       name="avatar_file"
       onChange={this.handleFileChange} />
<div className="button"
     onClick={this.upload}>
  upload?
</div>
*/
