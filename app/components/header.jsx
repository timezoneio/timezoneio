var React = require('react');
var Branding = require('./branding.jsx');
var UserMenu = require('./userMenu.jsx');

module.exports = React.createClass({

  displayName: 'Header',

  renderRightComponent: function() {

    var buttons = [];

    if (this.props.demo)
      buttons.push(
        <a key="demo"
           href="/team/buffer"
           className="button clear">
          Live demo
        </a>
      );

    if (this.props.user) {
      buttons.push(
        <UserMenu key="menu"
                  {...this.props.user} />
      );
    } else {
      buttons = buttons.concat(
        <a key="login"
           href="/login"
           className="button hollow">
          Login
        </a>
        ,
        <a key="signup"
           href="/signup"
           className="button hollow cta">
          Sign up
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
