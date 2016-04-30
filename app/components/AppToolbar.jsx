'use strict';
var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher');
var ActionTypes = require('../actions/actionTypes');
var Branding = require('./branding');
var UserMenu = require('./userMenu');
var TeamSearch = require('./TeamSearch');
var TimeControl = require('./TimeControl');

class AppToolbar extends React.Component {

  handleClickManage() {
    AppDispatcher.dispatchViewAction({
      actionType: ActionTypes.SHOW_VIEW,
      value: 'manage'
    });
  }

  render() {
    return (
      <div className="app-toolbar">

        <div className="app-toolbar-branding">
          <Branding
            link={true}
            minimal={true}
          />
        </div>

        <div className="app-toolbar-main">
          <TimeControl {...this.props} />
        </div>

        <div className="app-toolbar-actions">
          <TeamSearch people={this.props.people} />
          { this.props.isAdmin && (
            <button className="manage-team-button material-icons md-18 clear"
                    title="Manage your team"
                    onClick={this.handleClickManage}>
              settings
            </button>
          )}
          {
            this.props.user ?
            <UserMenu {...this.props.user} /> :
            <a href="/signup" className="button cta">
              Sign up
            </a>
          }

        </div>

      </div>
    );
  }

}

module.exports = AppToolbar;
