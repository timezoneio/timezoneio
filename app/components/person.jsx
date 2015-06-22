/** @jsx React.DOM */

var React = require('react');
var Avatar = require('./avatar.jsx');

module.exports = React.createClass({

  displayName: 'Person',

  render: function() {
    var person = this.props.model;
    return (
      <div className="person" key={person.name}>
        <Avatar avatar={person.avatar} />
        <div className="person-info">
          <p className="person-name">{person.name}</p>
          <p className="person-city">{person.location}</p>
        </div>
      </div>
    );
  }

});
