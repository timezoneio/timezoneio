/** @jsx React.DOM */

var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');

module.exports = React.createClass({
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
        <img src={person.avatar} className="avatar"/>
        <div className="person-info">
          <p className="person-name">{person.name}</p>
          <p className="person-city">{person.city}</p>
        </div>
      </div>
    );
  }
});
