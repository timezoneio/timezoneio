/** @jsx React.DOM */

var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');
var AppSidebar = require('../components/appSidebar.jsx');
var TimezoneList = require('../components/timezoneList.jsx');
var ManageTeam = require('../components/manageTeam.jsx');

module.exports = React.createClass({

  displayName: 'Team',

  handleClickMask: function(e) {
    AppDispatcher.dispatchViewAction({
      actionType: ActionTypes.CLOSE_MODAL
    });
  },

  getModal: function() {
    return;
    var currentView = this.props.currentView;

    if (currentView === 'app') return;

    // var modal = null;
    //
    // if (currentView === 'manage')
    //   modal = (<ManageModal {...this.props} />);

    return (
      <div className="modal-container"
           onClick={this.handleClickMask}>
        {modal}
      </div>
    );
  },

  getView: function() {
    var currentView = this.props.currentView;

    if (currentView === 'app') return;

    var view = null;

    if (currentView === 'manage')
      view = <ManageTeam {...this.props} />;

    return (
      <div className="view-container">
        {view}
      </div>
    );
  },

  render: function() {
    return (
      <div className="container app-container">

        <AppSidebar {...this.props} />

        <TimezoneList {...this.props}
                      showStats={true} />

        {this.getView()}

      </div>
    );
  }
});
