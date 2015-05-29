/** @jsx React.DOM */

var React = require('react');
var Branding = require('./branding.jsx');

module.exports = React.createClass({

  renderRightComponent: function() {

    var buttons = [];

    if (this.props.demo)
      buttons.push(
        <a href="/team/buffer" className="button cta">
          Live demo
        </a>
      );

    if (this.props.user) {
      var url = '/people/' + this.props.user.username;
      var style = { backgroundImage: 'url(' + this.props.user.avatar + ')' };
      buttons.push(
        <a href={url}
           className="avatar header-avatar"
           style={style}
           name={this.props.user.name}>
        </a>
      );
    } else {
      buttons.push(
        <a href="/login" className="button hollow">
          Login
        </a>
      );
    }

    return buttons;
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

