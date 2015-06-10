/** @jsx React.DOM */

var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');
var LocationAutocomplete = require('./locationAutocomplete.jsx');

module.exports = React.createClass({

  displayName: 'EditPerson',

  getInitialState: function() {
    return {
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

  handleClickSave: function(e) {
    // AppDispatcher.handleViewAction({
    //   actionType: ActionTypes.SAVE_TEAM_INFO,
    //   value: this.state
    // });
  },

  render: function() {

    var nameLink = {
      value: this.state.name,
      requestChange: this.handleChange.bind(null, 'name')
    };

    // var locationLink = {
    //   value: this.state.location,
    //   requestChange: this.handleChange.bind(null, 'name')
    // };


    return (
      <div>

        <img src={this.props.avatar} className="avatar" />

        <input type="text"
               name="name"
               valueLink={nameLink}
               placeholder="Name" />

        <LocationAutocomplete {...this.props} />

      </div>
    );
  }
});
