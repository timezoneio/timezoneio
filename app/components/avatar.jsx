/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({

  displayName: 'Avatar',

  getInitialState: function() {
    return {
      brokenImage: false,
    };
  },

  handleLoadSuccess: function() {
    if (this.state.brokenImage)
      this.setState({ brokenImage: false });
  },

  handleLoadError: function() {
    if (!this.state.brokenImage)
      this.setState({ brokenImage: true });
  },

  render: function() {

    var classes = 'avatar';
    if (this.props.size) classes += ' ' + this.props.size;

    return <img src={this.props.avatar}
                className={classes}
                onLoad={this.handleLoadSuccess}
                onError={this.handleLoadError} />
  }

});
