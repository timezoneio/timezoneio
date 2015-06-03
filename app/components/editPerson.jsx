/** @jsx React.DOM */

var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');

module.exports = React.createClass({

  displayName: 'EditPerson',

  getInitialState: function() {
    return {
      name: this.props.team.name
    }
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


    return (
      <div>
        <img src={this.props.avatar} className="avatar" />
        <input type="text" name="name" value={nameLink} placeholder="Name" />
        <input type="text" name="location" placeholder="Location" />


      </div>
    );
  }
});
