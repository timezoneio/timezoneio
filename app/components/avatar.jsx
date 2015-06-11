/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({

  displayName: 'Avatar',

  render: function() {

    var classes = 'avatar';
    if (this.props.size) classes += ' ' + this.props.size;

    return <img src={this.props.avatar} className={classes}/>
  }

});
