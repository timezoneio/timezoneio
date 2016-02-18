'use strict';

var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');
var AppSidebar = require('../components/appSidebar.jsx');
var AppToolbar = require('../components/AppToolbar.jsx');
var TimezoneList = require('../components/timezoneList.jsx');
var ManageTeam = require('../components/manageTeam.jsx');
var UserMenu = require('../components/userMenu.jsx');


class Team extends React.Component {

  handleClickMask(e) {
    AppDispatcher.dispatchViewAction({
      actionType: ActionTypes.CLOSE_MODAL
    });
  }

  getUserMenu() {
    if (!this.props.user) return '';
    return <UserMenu {...this.props.user}
                     fixed={true} />;
  }

  render() {

    if (this.props.currentView === 'manage')
      return <ManageTeam {...this.props} />;

    // Only Super admin and buffer have this design right now
    if (this.props.team &&
        this.props.team.slug === 'buffer' ||
        this.props.user &&
        this.props.user._id.toString() === '5513998f6d1aacc66f7e7eff')
      return (
        <div className="container app-container app-with-toolbar">
          <AppToolbar {...this.props} />
          <TimezoneList {...this.props}
                        showStats={true} />
        </div>
      );

    return (
      <div className="container app-container">
        <AppSidebar {...this.props} />
        <TimezoneList {...this.props}
                      showStats={true} />
        {this.getUserMenu()}
      </div>
    );
  }
}

module.exports = Team;
