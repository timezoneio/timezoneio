'use strict';

var React = require('react');
var classNames = require('classnames');
var getProfileUrl = require('../helpers/urls').getProfileUrl;
var DEFAULT_AVATAR = require('../helpers/images').DEFAULT_AVATAR;


class UserMenu extends React.Component {

  constructor(props) {
    super(props);
    this.closeMenu = this.closeMenu.bind(this);
    this.state = {
      open: false
    };
  }

  closeMenu() {
    this.setState({ open: false });
    window.removeEventListener('click', this.closeMenu);
  }

  openMenu() {
    this.setState({ open: true });
    window.addEventListener('click', this.closeMenu);
  }

  handleToggleMenu(e) {
    e.stopPropagation();
    this.state.open ? this.closeMenu() : this.openMenu();
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.closeMenu);
  }

  render() {

    var profileUrl = getProfileUrl(this.props);
    var avatarUrl = this.props.avatar || DEFAULT_AVATAR;
    var style = { backgroundImage: 'url(' + avatarUrl + ')' };

    var containerClasses = classNames('user-menu-container', {
      'fixed': this.props.fixed
    });

    var menuClasses = classNames('user-menu', {
      'menu-open': this.state.open
    });

    return (
      <div className={containerClasses}>

        <div className={menuClasses}>
          <a href={profileUrl}
             className="user-menu-item">
            Profile
          </a>
          <a href="/team"
             className="user-menu-item">
            Add your team
          </a>
          <a href="/logout"
             className="user-menu-item">
            Logout
          </a>
        </div>

        <a onClick={this.handleToggleMenu.bind(this)}
           className="avatar header-avatar"
           style={style}
           name={this.props.name}>
        </a>

      </div>
    );
  }
};

module.exports = UserMenu;
