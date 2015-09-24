'use strict';
var React = require('react');
var Avatar = require('./avatar.jsx');
var ActionCreators = require('../actions/actionCreators.js');
const DEFAULT_AVATAR = require('../helpers/images').DEFAULT_AVATAR;

class Person extends React.Component {

  handleToggleSelected() {
    ActionCreators.toggleSelectPerson(this.props.model._id);
  }

  render() {
    var person = this.props.model;
    return (
      <div className="person"
           key={person._id}
           onClick={this.handleToggleSelected.bind(this)}>
        <Avatar avatar={person.avatar || DEFAULT_AVATAR} />
        <div className="person-info">
          <p className="person-name">{person.name}</p>
          <p className="person-city">{person.location || 'Location needed!'}</p>
        </div>
      </div>
    );
  }

};

module.exports = Person;
