var React = require('react');
var toolbelt = require('../utils/toolbelt.js');
var ActionCreators = require('../actions/actionCreators.js');
var LocationAutocomplete = require('./locationAutocomplete.jsx');
var Avatar = require('./avatar.jsx');

var SAVE_BUTTON_STATES = ['Save', 'Saving', 'Saved'];
var ADD_BUTTON_STATES = ['Add', 'Adding', 'Added'];

module.exports = React.createClass({

  displayName: 'EditPerson',

  getInitialState: function() {
    return {
      saveButtonText: this.props.isNewUser ?
                        ADD_BUTTON_STATES[0] :
                        SAVE_BUTTON_STATES[0],
      error: '',

      isNewUser: this.props.isNewUser,

      email: this.props.email,
      name: this.props.name,
      location: this.props.location,
      tz: this.props.tz,
      avatar: this.props.avatar
    };
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

  handleClickSave: function(e) {
    var BUTTON_STATES = this.state.isNewUser ?
                          ADD_BUTTON_STATES :
                          SAVE_BUTTON_STATES;

    this.setState({ saveButtonText: BUTTON_STATES[1] });

    var data = toolbelt.extend(this.state, { teamId: this.props.teamId });
    delete data.error;
    delete data.saveButtonText;


    var createOrUpdateUser = this.state.isNewUser ?
                              ActionCreators.addNewTeamMember(data) :
                              ActionCreators.saveUserInfo(this.props._id, data);

    createOrUpdateUser
      .then(function(res) {

        this.setState({
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

  handleClickUseGravatar: function(e) {
    ActionCreators.getGravatar(this.state.email)
      .then(function(avatar) {
        if (avatar)
          this.setState({ avatar: avatar });
      }.bind(this), function(err) {
        this.setState({
          error: err.message
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

    return (
      <div className="edit-person">

        <div className="edit-person--row">
          { this.state.avatar ? (
              <Avatar avatar={this.state.avatar}
                      size="large" />
            ) : (
              <div className="add-image-placeholder">
                <small>Add image below</small>
              </div>
            )
          }
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

        { //this.state.isNewUser &&
          // FUTURE - ONLY ALLOW USER TO EDIT THEIR OWN EMAIL
          <div className="edit-person--row">
            <input type="text"
                   name="email"
                   valueLink={emailLink}
                   placeholder="E-mail" />
          </div>
        }

        <div className="edit-person--row">
          <input type="text"
                 name="avatar"
                 valueLink={avatarLink}
                 placeholder="Avatar URL" />
        </div>

        <div className="edit-person--row">
          <button onClick={this.handleClickUseGravatar}>
            Use Gravatar
          </button>
        </div>

        <div className="edit-person--row">
          <button onClick={this.handleClickSave}>
            {this.state.saveButtonText}
          </button>
        </div>

        { this.state.error &&
            <p className="edit-person--row error">{this.state.error}</p>
        }

      </div>
    );
  }
});
