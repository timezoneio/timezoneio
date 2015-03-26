/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
  
  renderRightComponent: function() {
    if (this.props.demo)
      return (
        <a href="/team/buffer" className="button cta">
          Live demo
        </a>
      );

    return '';
  },

  render: function() {
    return (
      <header className="site-header">
        <h1 className="site-branding">Timezone.io</h1>
        <div className="site-header--right">
          {this.renderRightComponent()}
        </div>
      </header>
    );
  }
});

