/** @jsx React.DOM */

var React = require('react');
var Branding = require('./branding.jsx');

module.exports = React.createClass({

  renderRightComponent: function() {
    if (this.props.user) {
      var url = '/people/' + this.props.user.username;
      var style = { backgroundImage: 'url(' + this.props.user.avatar + ')' };
      return (
        <a href={url}
           className="avatar header-avatar"
           style={style}
           name={this.props.user.name}>
        </a>
      );
    }

    if (this.props.demo)
      return (
        <a href="/team/buffer" className="button cta">
          Live demo
        </a>
      );

    return '';
  },

  render: function() {
    var link = this.props.link === false ? false : true;
    return (
      <header className="site-header">
        <Branding link={link} />
        <div className="site-header--right">
          {this.renderRightComponent()}
        </div>
      </header>
    );
  }
});

