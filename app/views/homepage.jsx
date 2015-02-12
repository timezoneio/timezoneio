/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div className="homepage-container">
        <h1>Timezone.io</h1>
        <h2>Keep track where and <em>when</em> your team is.</h2>
      </div>
    );
  }
});