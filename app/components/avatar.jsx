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

  handleLoadError: function(e) {
    if (!this.state.brokenImage)
      this.setState({ brokenImage: true });
    if (typeof this.props.onImageLoadError === 'function')
      this.props.onImageLoadError(e);
  },

  render: function() {

    var classes = 'avatar';
    if (this.props.size) classes += ' ' + this.props.size;

    return (
      <img src={this.props.avatar}
           className={classes}
           onLoad={this.handleLoadSuccess}
           onError={this.handleLoadError} />
     );
  }

});
