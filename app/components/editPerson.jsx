var React = require('react');
var toolbelt = require('../utils/toolbelt');
var extend = require('lodash/object/extend');
var imageHelpers = require('../helpers/images');
var ActionCreators = require('../actions/actionCreators');
var isValidEmail = require('../utils/strings').isValidEmail;
var LocationAutocomplete = require('./locationAutocomplete.jsx');
var Avatar = require('./avatar.jsx');
var ProfileLocation = require('./profileLocation.jsx');
var UploadButton = require('./UploadButton.jsx');

var SAVE_BUTTON_STATES = ['Save', 'Saving', 'Saved'];
var ADD_BUTTON_STATES = ['Add to team', 'Adding', 'Added'];


var EditPerson = React.createClass({

  getInitialState: function() {
    return {
      saveButtonText: this.props.isNewUser ?
                        ADD_BUTTON_STATES[0] :
                        SAVE_BUTTON_STATES[0],
      error: '',

      // Does the user need to be created?
      isNewUser: false,
      // Are we viewing/editing a user in the db or on the team?
      isExistingUser: !!this.props._id,
      // Are we in invite mode here?
      inviteTeamMember: this.props.inviteTeamMember,
      // Is the user registered for their own account?
      isRegistered: this.props.isRegistered,

      userId: this.props._id,
      email: this.props.email,
      name: this.props.name,
      location: this.props.location,
      tz: this.props.tz,
      avatar: this.props.avatar,

      emailHash: null,
      avatarFull: null // temp file for upload while we wait for resize
    };
  },

  getFileName: function() {
    return this.state.userId || this.state.emailHash;
  },

  handleChange: function(name, value) {
    var newState = {};
    newState[name] = value;
    this.setState(newState);
  },

  handleLocationChange: function(location, tz) {
    this.setState({
      location: location,
      tz: tz || this.state.tz
    });
  },

  handleUploaded: function(fileUrls) {
    this.setState({
      avatarFull: fileUrls.full,
      avatar: fileUrls.resized
    });
  },

  handleClickSave: function(e) {
    var BUTTON_STATES = this.state.isNewUser ?
                          ADD_BUTTON_STATES :
                          SAVE_BUTTON_STATES;

    this.setState({ saveButtonText: BUTTON_STATES[1] });

    var data = extend(this.state, { teamId: this.props.teamId });
    delete data.error;
    delete data.saveButtonText;

    var createOrUpdateUser = this.state.isNewUser ?
                              ActionCreators.addNewTeamMember(data) :
                              ActionCreators.saveUserInfo(this.state.userId, data);

    createOrUpdateUser
      .then(function(res) {

        this.setState({
          inviteTeamMember: false,
          isNewUser: false,
          error: '', // clear the error
          saveButtonText: BUTTON_STATES[2]
        });

        setTimeout(function() {
          this.setState({ saveButtonText: SAVE_BUTTON_STATES[0] });
        }.bind(this), 4000);

      }.bind(this), function(err) {
        this.setState({
          error: err.message,
          saveButtonText: BUTTON_STATES[0]
        });
      }.bind(this));
  },

  handleClickAdd: function(e) {
    this.setState({ saveButtonText: ADD_BUTTON_STATES[1] });

    ActionCreators.addTeamMember(this.props.teamId, this.state.userId)
      .then(function(user) {
        this.setState(extend({ }, this.state, user, {
          error: '',
          userId: user._id,
          isExistingUser: true,
          isNewUser: false,
          saveButtonText: ADD_BUTTON_STATES[2]
        }));
      }.bind(this))
      .catch(function(err) {
        this.setState({
          error: err.message,
          saveButtonText: ADD_BUTTON_STATES[0]
        });
      }.bind(this));
  },

  onImageLoadError: function(e) {
    this.setState({ avatar: null });
  },

  handleClickUseGravatar: function(e) {
    ActionCreators.getGravatar(this.state.email)
      .then(function(avatar) {
        if (avatar)
          this.setState({ avatar: avatar + '&d=404' });
      }.bind(this), function(err) {
        this.setState({ error: err.message });
      }.bind(this));
  },

  handleEmailKeyDown: function(e) {
    if (e.keyCode === 13)
      this.handleCheckUserEmail();
    else if (this.state.error)
      this.setState({ error: null });
  },

  handleCheckUserEmail: function() {

    if (!isValidEmail(this.state.email))
      return this.setState({ error: 'Please enter a valid email ;)' });

    if (toolbelt.indexOf({ email: this.state.email }, this.props.people) !== -1)
      return this.setState({ error: 'This person is already on your team :)' });

    ActionCreators.getUserByEmail(this.state.email, this.props.teamId)
      .then(function(response) {
        // if message, then no user found!
        if (response.message) {
          this.setState({
            emailHash: response.hash,
            isNewUser: true,
            isExistingUser: false
          });
          this.handleClickUseGravatar();
        } else {
          // set limited user data
          var user = response;
          this.setState(extend({ }, this.state, user, {
            userId: user._id,
            isExistingUser: true,
            isNewUser: false,
            saveButtonText: ADD_BUTTON_STATES[0]
          }));
        }
      }.bind(this))
      .catch(function(err) {
        this.setState({
          error: err.message,
          isNewUser: false,
          isExistingUser: false
        });
      }.bind(this));
  },

  render: function() {

    var nameLink = {
      value: this.state.name,
      requestChange: this.handleChange.bind(null, 'name')
    };

    var emailLink = {
      value: this.state.email,
      requestChange: this.handleChange.bind(null, 'email')
    };

    var avatarLink = {
      value: this.state.avatar,
      requestChange: this.handleChange.bind(null, 'avatar')
    };

    if (this.state.inviteTeamMember && !this.state.isNewUser && !this.state.isExistingUser) {
      return (
        <div className="edit-person">
          <p>Enter your teammate's email address:</p>
          <div className="edit-person--row">
            <input type="text"
                   name="email"
                   valueLink={emailLink}
                   onKeyDown={this.handleEmailKeyDown}
                   placeholder="E-mail" />
          </div>
          <div className="edit-person--row">
            <button className="cta"
                    onClick={this.handleCheckUserEmail}>
              Next
            </button>
          </div>
          { this.state.error &&
              <p className="edit-person--row error">{this.state.error}</p>
          }
        </div>
      );
    }

    var canEditUser = !this.state.isRegistered;

    return (
      <div className="edit-person">

        { this.state.isNewUser && (
          <p className="txt-center">
            Add your teammate's information <br/>
            or wait for them to add it!
          </p>
        )}

        <div className="edit-person--row">
          { this.state.avatar ? (
              <Avatar avatar={this.state.avatarFull ||
                              this.state.avatar ||
                              imageHelpers.DEFAULT_AVATAR}
                      onImageLoadError={this.onImageLoadError}
                      size="large" />
            ) : (
              <div className="add-image-placeholder">
                <small>Add image below</small>
              </div>
            )
          }
        </div>

        { canEditUser ? (
          <div>

            <div className="edit-person--row">
              <UploadButton fileName={this.getFileName()}
                            handleUploaded={this.handleUploaded} />
            </div>

            <div className="edit-person--row">
              <input type="text"
                     name="name"
                     valueLink={nameLink}
                     placeholder="Name" />
            </div>

            <div className="edit-person--row">
              <LocationAutocomplete {...this.props}
                                    handleChange={this.handleLocationChange} />
              <span className="edit-person--timezone-display">
                {this.state.tz}
              </span>
            </div>

            <div className="edit-person--row txt-center">
              <button onClick={this.handleClickSave}>
                {this.state.saveButtonText}
              </button>
            </div>

          </div>
        ) : (
          <div className="edit-person--row">

            <h3 className="txt-center">{this.state.name}</h3>

            <ProfileLocation location={this.state.location}
                             tz={this.state.tz}
                             time={new Date().valueOf()}
                             timeFormat={this.props.timeFormat} />

           <div className="edit-person--row txt-center">
              <button onClick={this.handleClickAdd}>
                {this.state.saveButtonText}
              </button>
            </div>

          </div>
        )}

        { this.state.error &&
            <p className="edit-person--row error">{this.state.error}</p>
        }

      </div>
    );
  }
});

module.exports = EditPerson;
