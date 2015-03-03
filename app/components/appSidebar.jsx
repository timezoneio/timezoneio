/** @jsx React.DOM */

var React = require('react');
var time = require('../utils/time.js');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');

module.exports = React.createClass({
  handleFormatChange: function(e) {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.CHANGE_TIME_FORMAT,
      value: +e.target.dataset.format
    });
  },
  render: function() {
    
    var format = this.props.timeFormat;
    var formatString = time.getFormatStringFor(this.props.timeFormat);
    var displayTime = this.props.time.format(formatString);

    return <div className="app-sidebar">
      
      <h2 className="app-sidebar--time">{displayTime}</h2>

      <div className="button-group app-sidebar--format-select">
        <button className={'small hollow ' + (format === 12 ? 'selected' : '')}
                data-format="12"
                onClick={this.handleFormatChange}>12 hour</button>
        <button className={'small hollow ' + (format === 24 ? 'selected' : '')}
                data-format="24"
                onClick={this.handleFormatChange}>24 hour</button>
      </div>

    </div>;
  }
});