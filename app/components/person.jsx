/** @jsx React.DOM */

var React = require('react');
var Avatar = require('./avatar.jsx');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');

module.exports = React.createClass({

  displayName: 'Person',

  handleToggleSelected: function() {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.TOGGLE_SELECT_PERSON,
      value: this.props.model
    });
  },
  render: function() {
    var person = this.props.model;
    return (
      <div className="person"
           key={person._id}
           onClick={this.handleToggleSelected}>
        <Avatar avatar={person.avatar} />
        <div className="person-info">
          <p className="person-name">{person.name}</p>
          <p className="person-city">{person.location}</p>
        </div>
      </div>
    );
  }

});
