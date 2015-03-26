/** @jsx React.DOM */

var React = require('react');
var Header = require('../components/header.jsx');

module.exports = React.createClass({
  render: function() {
    var person = this.props.user;
    return (
      <div className="container person-container">

        <Header />

        <img src={person.avatar} className="avatar large"/>

        <h2 className="person-name">{person.name}</h2>

        <h3 className="person-city">{person.location}</h3>

      </div>
    );
  }
});