'use strict';
var React = require('react');
var classNames = require('classnames');
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

  handleAvatarLoadError() {
    ActionCreators.fixBrokenAvatar(this.props.person._id);
  }

  render() {
    var person = this.props.person;

    var personClasses = 'person';
    if (this.props.isHighlighted) personClasses += ' person-highlight';

    var location = person.location === null ? '' :
                   person.location === '' ? 'Location needed!' :
                   person.location;

    var infoClasses = classNames('person-info', {
      'person-info-short': !person.location
    });

    return (
      <div className={personClasses}
           key={person._id}
           onClick={this.handleToggleSelected.bind(this)}>
        {
          person.avatar ?
            <Avatar
              avatar={person.avatar || DEFAULT_AVATAR}
              onImageLoadError={this.handleAvatarLoadError.bind(this)}
            />
          :
            <div className="avatar-placeholder">
              {this.getInitials(person.name)}
            </div>
        }

        <div className={infoClasses}>
          <p className="person-name">{person.name}</p>
          {location && <p className="person-city">{location}</p>}
        </div>
      </div>
    );
  }

};

module.exports = Person;
