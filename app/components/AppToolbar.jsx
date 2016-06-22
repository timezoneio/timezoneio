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

  handleChangeGrouping(e) {
    AppDispatcher.dispatchViewAction({
      actionType: ActionTypes.CHANGE_GROUP_BY,
      value: e.target.value
    });
  }

  render() {
    return (
      <div className="app-toolbar">

        <div className="app-toolbar-section app-toolbar-left">

          <div className="app-toolbar-branding">
            <Branding
              link={true}
              minimal={true}
            />
          </div>

          <div className="app-toolbar-main">
            <TimeControl {...this.props} />
          </div>

        </div>

        <div className="app-toolbar-section app-toolbar-center">
          <h2 className="app-toolbar-name">
            {this.props.team.name}
          </h2>
        </div>

        <div className="app-toolbar-section app-toolbar-right">
          <div className="app-toolbar-actions">

            {this.props.isBeta && (
              <select
                defaultValue="placeholder"
                onChange={this.handleChangeGrouping}
              >
                <option value="placeholder" disabled="disabled">Group by</option>
                <option value="utcOffset">Timezone</option>
                <option value="location">Location</option>
              </select>
            )}

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

      </div>
    );
  }

}

module.exports = AppToolbar;
