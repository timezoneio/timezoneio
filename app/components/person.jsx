'use strict';
var React = require('react');
var Avatar = require('./avatar.jsx');
var ActionCreators = require('../actions/actionCreators.js');
const DEFAULT_AVATAR = require('../helpers/images').DEFAULT_AVATAR;

class Person extends React.Component {

  handleToggleSelected() {
    ActionCreators.toggleSelectPerson(this.props.person._id);
  }

  getInitials(name) {
    return name.replace(/[^A-Z]/g, '') || (name[0] && name[0].toUpperCase());
  }

  render() {
    var person = this.props.person;

    var personClasses = 'person';
    if (this.props.isHighlighted) personClasses += ' person-highlight';

    return (
      <div className={personClasses}
           key={person._id}
           onClick={this.handleToggleSelected.bind(this)}>
        {
          person.avatar ?
            <Avatar avatar={person.avatar || DEFAULT_AVATAR} />
          :
            <div className="avatar-placeholder">
              {this.getInitials(person.name)}
            </div>
        }

        <div className="person-info">
          <p className="person-name">{person.name}</p>
          <p className="person-city">{person.location || 'Location needed!'}</p>
        </div>
      </div>
    );
  }

};

module.exports = Person;
