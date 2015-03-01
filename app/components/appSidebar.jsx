/** @jsx React.DOM */

var React    = require('react');


module.exports = React.createClass({
  render: function() {
    var time = this.props.time.format(this.props.timeFormat);
    return <div className="app-sidebar">
      <h2 className="app-sidebar--time">{time}</h2>
      
    </div>;
  }
});