var React = require('react');
var Avatar = require('./avatar.jsx');
var ActionCreators = require('../actions/actionCreators.js');

module.exports = React.createClass({

  displayName: 'Person',

  handleToggleSelected: function() {
    ActionCreators.toggleSelectPerson(this.props.model._id);
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
