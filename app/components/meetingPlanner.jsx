/** @jsx React.DOM */

var React = require('react');
var toolbelt = require('../utils/toolbelt.js');
var Avatar = require('./avatar.jsx');
var Schedule = require('./schedule.jsx');

module.exports = React.createClass({

  displayName: 'MeetingPlanner',

  renderEmpty: function() {
    return (
      <div className="meeting-planner-cta">
        <p className="meeting-planner-cta-text">
          Click a team member <br/>
          to plan a meeting
        </p>
      </div>
    );
  },

  render: function() {

    if (!this.props.groups || !this.props.groups.length)
      return this.renderEmpty();

    console.info(this.props);

    return (
      <div className="meeting-planner">

        <div className="meeting-planner-sugggested">
          {this.props.suggestedTime}
        </div>

        {this.props.groups.map(function(group, idx) {
          return (
            <div key={idx}
                 className="meeting-planner-group">
              <div className="meeting-planner-group-people">
                {group.people.map(function(p, idx) {
                  return <Avatar key={idx}
                                 avatar={p.avatar}
                                 size={'mini'} />
                })}
              </div>
            </div>
          );
        })}

      </div>
    );
  }
});

// {selectedPeople.map(function(person) {
//   return <Schedule person={person}
//                    timeFormat={this.props.timeFormat} />;
// }.bind(this))}
