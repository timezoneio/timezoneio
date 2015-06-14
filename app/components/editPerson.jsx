/** @jsx React.DOM */

var React = require('react');
var ActionCreators = require('../actions/actionCreators.js');
var LocationAutocomplete = require('./locationAutocomplete.jsx');
var Avatar = require('./avatar.jsx');

module.exports = React.createClass({

  displayName: 'EditPerson',

  getInitialState: function() {
    return {
      saveButtonText: 'Save',

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
      tz: tz
    })
  },

  handleClickSave: function(e) {
    this.setState({ saveButtonText: 'Saving' });
    ActionCreators.saveUserInfo(this.props._id, this.state)
      .then(function() {
        this.setState({ saveButtonText: 'Saved' });
        setTimeout(function() {
          this.setState({ saveButtonText: 'Save' });
        }.bind(this), 4000);
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
          <Avatar avatar={this.props.avatar}
                  size="large" />
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

        <div className="edit-person--row">
          <input type="text"
                 name="avatar"
                 valueLink={avatarLink}
                 placeholder="Avatar URL" />
        </div>

        <div className="edit-person--row">
          <button onClick={this.handleClickSave}>
            {this.state.saveButtonText}
          </button>
        </div>

      </div>
    );
  }
});

        // <div className="edit-person--row">
        //   <input type="text"
        //          name="email"
        //          valueLink={emailLink}
        //          placeholder="E-mail" />
        // </div>
