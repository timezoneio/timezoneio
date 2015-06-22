/** @jsx React.DOM */

var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');

module.exports = React.createClass({

  displayName: 'Modal',

  handleClickClose: function(e) {
    AppDispatcher.dispatchViewAction({
      actionType: ActionTypes.CLOSE_MODAL
    });
  },

  handleClick: function(e) {
    e.stopPropagation();
  },

  render: function() {
    var classes = 'modal';
    if (this.props.className) classes += ' ' + this.props.className;
    return (
      <div className={classes}
           onClick={this.handleClick}>
        <a className="modal-close"
           onClick={this.handleClickClose}>
          +
        </a>
        {this.props.children}
      </div>
    );
  }
});
