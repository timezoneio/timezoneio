/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({

  displayName: 'Notification',

  render: function() {
    var className = 'notification';

    if (this.props.style)
      className += ' notification-' + this.props.style;

    var text = Array.isArray(this.props.text) ?
               this.props.text.join('<br>') :
               this.props.text;

    if (!text)
      return <span style={{display: 'none'}}></span>;

    return (
      <div className={className}>
        {text}
      </div>
    );
  }
});
