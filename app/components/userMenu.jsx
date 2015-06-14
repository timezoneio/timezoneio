/** @jsx React.DOM */

var React = require('react');
var classNames = require('classnames');

module.exports = React.createClass({

  getInitialState: function() {
    return { open: false };
  },

  closeMenu: function(e) {
    this.setState({ open: false });
  },

  handleToggleMenu: function(e) {
    e.stopPropagation();
    this.setState({ open: !this.state.open });
  },

  componentDidMount: function() {
    // Move this one day
    window.addEventListener('click', this.closeMenu);
  },

  render: function() {

    var profileUrl = '/people/' + this.props.username;
    var style = { backgroundImage: 'url(' + this.props.avatar + ')' };

    var menuClasses = classNames('site-header-menu', {
      'menu-open': this.state.open
    });

    return (
      <div className="site-header-menu-container">

        <div className={menuClasses}>
          <a href={profileUrl}
             className="site-header-menu-item">
            Profile
          </a>
          <a href="/logout"
             className="site-header-menu-item">
            Logout
          </a>
        </div>

        <a onClick={this.handleToggleMenu}
           className="avatar header-avatar"
           style={style}
           name={this.props.name}>
        </a>

      </div>
    );
  }
});

