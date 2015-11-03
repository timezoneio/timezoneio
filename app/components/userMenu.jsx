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

  handleClickMenu(e) {
    e.stopPropagation();
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

        <div className={menuClasses}
             onClick={this.handleClickMenu}>

          <div className="user-menu-section">

            <p className="user-menu-section-name">
              {this.props.name}
            </p>

            {this.props.location && (
              <div className="user-menu-section-location">
                <span className="material-icons location-icon">place</span>
                <span>
                  {this.props.location}
                </span>
              </div>
            )}

            <a href={profileUrl}
               className="user-menu-item">
              View profile
            </a>

            <a href="/account"
               className="user-menu-item">
              Account settings
            </a>

            <a href="/logout"
               className="user-menu-item">
              Sign out
            </a>

          </div>

          <div className="user-menu-section">
            <p className="user-menu-section-header">
              Teams
            </p>
            {this.props.teams && this.props.teams.map(function(team, idx) {
              return (
                <a key={idx}
                   href={team.url}
                   className="user-menu-item">
                  {team.name}
                </a>
              )
            })}
            <a href="/team"
               className="button small">
              Add your team
            </a>
          </div>

        </div>

        <div className="user-menu-toggle"
             onClick={this.handleToggleMenu.bind(this)}>
          <div className="avatar header-avatar"
             style={style}
             name={this.props.name}>
          </div>
        </div>

      </div>
    );
  }
};

module.exports = UserMenu;
