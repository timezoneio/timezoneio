/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({

  handleClick: function(e) {
    e.stopPropagation();
  },

  render: function() {
    return (
      <div className="modal"
           onClick={this.handleClick}>
        {this.props.children}
      </div>
    );
  }
});
