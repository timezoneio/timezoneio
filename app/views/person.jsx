var React = require('react');
var classNames = require('classnames');
var Header = require('../components/header.jsx');
var Notification = require('../components/notification.jsx');
var ProfileLocation = require('../components/profileLocation.jsx');
var LocationAutocomplete = require('../components/locationAutocomplete.jsx');
var UploadButton = require('../components/UploadButton.jsx');
var ActionCreators = require('../actions/actionCreators');
var toolbelt = require('../utils/toolbelt');
const DEFAULT_AVATAR = require('../helpers/images').DEFAULT_AVATAR;

const SAVE_BUTTON_STATES = ['Save', 'Saving', 'Saved'];


module.exports = React.createClass({

  displayName: 'PersonView',

  getInitialState: function() {
    return  {
      editMode: false,
      error: '',
      saveButtonText: SAVE_BUTTON_STATES[0],
      checkingLocation: false,

      avatarFull: null, // placeholder while avatar is resized

      // email: this.props.email,
      name: this.props.profileUser.name,
      avatar: this.props.profileUser.avatar,
      location: this.props.profileUser.location,
      tz: this.props.profileUser.tz,
      coords: this.props.profileUser.coords
    };
  },

  componentDidMount: function() {
    if (this.isOwnProfile())
      setTimeout(this.updateUserLocation, 10);
  },

  updateUserLocation: function() {
    this.setState({ checkingLocation: true });

    ActionCreators.getUserLocationAndTimezone(this.state)
      .then(function(positionData) {

        // Immediately save the user's profile data
        var newState = { checkingLocation: false };
        if (this.state.location !== positionData.location ||
            this.state.tz !== positionData.tz ||
            this.state.coords.lat !== positionData.coords.lat ||
            this.state.coords.long !== positionData.coords.long) {
          this.setState(
            toolbelt.extend({ checkingLocation: false }, positionData)
          );
          this.saveProfile();
        } else {
          this.setState({ checkingLocation: false });
        }
      }.bind(this))
      .catch(function(err) {
        this.setState({
          checkingLocation: false,
          useLocationFallback: true
        });
      }.bind(this));
  },

  handleLocationAutocompleteChange: function(location, tz) {
    this.setState({
      location: location,
      tz: tz
    });
  },

  isOwnProfile: function() {
    return !!this.props.user &&
           this.props.user._id.toString() === this.props.profileUser._id.toString();
  },

  handleAvatarUploaded: function(fileUrls) {
    this.setState({
      avatarFull: fileUrls.full,
      avatar: fileUrls.resized
    });

    // Now save the profile!
    this.saveProfile();
  },

  handleToggleProfileEdit: function(e) {
    e.preventDefault();
    this.setState({ editMode: !this.state.editMode });
  },

  handleClickUseGravatar: function(e) {
    e.preventDefault();
    // NOTE - Use state if user can change email
    ActionCreators.getGravatar(this.props.profileUser.email)
      .then(function(avatar) {
        if (avatar) {
          this.setState({
            avatar: avatar,
            avatarFull: null
          });
          this.saveProfile();
        }
      }.bind(this), function(err) {
        this.setState({
          error: err.message
        });
      }.bind(this));
  },

  handleChange: function(name, value) {
    var newState = {};
    newState[name] = value;
    this.setState(newState);
  },

  saveProfile: function() {
    this.setState({ saveButtonText: SAVE_BUTTON_STATES[1] });

    var data = toolbelt.extend(this.state, { teamId: this.props.teamId });
    var saveData = toolbelt.pluck('name', 'avatar', 'location', 'tz', 'coords', data);

    ActionCreators.saveUserInfo(this.props.profileUser._id, saveData)
      .then(function(res) {

        this.setState({
          error: '',
          saveButtonText: SAVE_BUTTON_STATES[2]
        });

        setTimeout(function() {
          this.setState({ saveButtonText: SAVE_BUTTON_STATES[0] });
        }.bind(this), 4000);

      }.bind(this), function(err) {
        this.setState({
          error: err.message
        });
      }.bind(this));
  },

  render: function() {
    var profileUser = this.props.profileUser;

    var viewClasses = classNames('profile-details', {
      'hidden': this.state.editMode
    });
    var editClasses = classNames('profile-edit', {
      'hidden': !this.state.editMode
    });

    var nameLink = {
      value: this.state.name,
      requestChange: this.handleChange.bind(null, 'name')
    };
    var avatarLink = {
      value: this.state.avatar,
      requestChange: this.handleChange.bind(null, 'avatar')
    };

    var locationText = this.state.location ||
                       (this.state.checkingLocation ?
                        'Searching...' :
                        'Click to set location'
                       );
    var locationError = !this.state.location &&
                        !this.state.checkingLocation &&
                        this.state.useLocationFallback;

    return (
      <div className="container">

        <Header {...this.props} />

        <div className="profile">

          <Notification style="error"
                        text={this.props.errors}
                        allowDismiss={true} />

          <div className="profile-main">

            <img src={this.state.avatarFull || this.state.avatar || DEFAULT_AVATAR}
                 className="avatar large profile-avatar" />

            <div className={viewClasses}>

              <h2 className="profile-name">{this.state.name}</h2>

              <ProfileLocation location={locationText}
                               tz={this.state.tz}
                               time={this.props.time}
                               timeFormat={this.props.timeFormat}
                               error={locationError}
                               loading={this.state.checkingLocation}
                               onClick={this.state.useLocationFallback &&
                                        this.handleToggleProfileEdit} />

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

              { this.isOwnProfile() &&
                <p>
                  <a href="#"
                     onClick={this.handleToggleProfileEdit}>
                    Edit your profile
                  </a>
                </p>
              }

            </div>
          </div>

          { this.isOwnProfile() &&
            <div className={editClasses}>

              <div className="profile-avatar-options">
                <span>
                  Use photo from
                </span>
                <a href="/connect/twitter?use_avatar=true"
                   className="button twitter">
                  Twitter
                </a>
                <a href="#"
                   className="button gravatar"
                   onClick={this.handleClickUseGravatar}>
                  Gravatar
                </a>
                <span>
                  or
                </span>
                <UploadButton fileName={this.props.profileUser._id.toString()}
                              handleUploaded={this.handleAvatarUploaded} />
              </div>

              <div className="profile-edit-form">

                <div className="form-row">
                  <label>Name</label>
                  <input type="text" name="name" valueLink={nameLink} />
                </div>

                { this.state.useLocationFallback ? (
                  <div>
                    <p>
                      Type below to search for your location
                    </p>
                    <LocationAutocomplete location={this.state.location}
                                          handleChange={this.handleLocationAutocompleteChange} />
                    <span className="edit-person--timezone-display">
                      {this.props.user.tz}
                    </span>
                  </div>
                ) : (
                  <input type="hidden" name="location" value={this.state.location} />
                )}


                <input type="hidden" name="tz"
                       value={this.state.tz} />
                <input type="hidden" name="avatar"
                       value={this.state.avatar} />
                <input type="hidden" name="coords[lat]"
                       value={this.state.coords && this.state.coords.lat} />
                <input type="hidden" name="coords[long]"
                       value={this.state.coords && this.state.coords.long} />

                <div className="form-row">
                  <button title="Go back to your profile"
                          onClick={this.handleToggleProfileEdit}>
                    Go back
                  </button>
                  <button className="cta"
                          title="Save your profile"
                          onClick={this.saveProfile}>
                    {this.state.saveButtonText}
                  </button>
                </div>
              </div>

              <Notification style="error"
                            text={this.state.error} />
            </div>
          }

        </div>

      </div>
    );
  }
});
