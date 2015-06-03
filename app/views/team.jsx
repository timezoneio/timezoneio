/** @jsx React.DOM */

var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');
var AppSidebar = require('../components/appSidebar.jsx');
var TimezoneList = require('../components/timezoneList.jsx');
var ManageModal = require('../components/manageModal.jsx');

module.exports = React.createClass({

  handleClickMask: function(e) {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.CLOSE_MODAL
    });
  },

  getModal: function() {
    var currentView = this.props.currentView;

    if (currentView === 'app') return;

    var modal = null;

    if (currentView === 'manage')
      modal = <ManageModal {...this.props} />

    return (
      <div className="modal-container"
           onClick={this.handleClickMask}>
        {modal}
      </div>
    );
  },

  render: function() {
    return (
      <div className="container app-container">

        <AppSidebar {...this.props} />

        <TimezoneList time={this.props.time}
                      timeFormat={this.props.timeFormat}
                      timezones={this.props.timezones} />

        {this.getModal()}

      </div>
    );
  }
});
