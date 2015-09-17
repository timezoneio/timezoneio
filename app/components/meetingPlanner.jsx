var React = require('react');
var toolbelt = require('../utils/toolbelt.js');
var ActionCreators = require('../actions/actionCreators.js');
var Avatar = require('./avatar.jsx');
var Schedule = require('./schedule.jsx');

module.exports = React.createClass({

  displayName: 'MeetingPlanner',

  handleClearGroups: function(e) {
    e.preventDefault();
    ActionCreators.clearMeetingGroups();
  },

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

    return (
      <div className="meeting-planner">

        { this.props.suggestedTime ?
            <div className="meeting-planner-sugggested">
              {this.props.suggestedTime}
              <div className="meeting-planner-sugggested-copy">
                Local time
              </div>
            </div>
          :
            <div className="meeting-planner-sugggested">
              <div className="meeting-planner-sugggested-copy">
                No good time window
              </div>
            </div>
        }


        {this.props.groups.map(function(group, idx) {
          return (
            <div key={idx}
                 className="meeting-planner-group">
              <div className="meeting-planner-group-suggested">
                {group.suggestedTime}
              </div>
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

        <div className="meeting-planner-clear">
          <a href="#"
             onClick={this.handleClearGroups}>
            Clear
          </a>
        </div>

      </div>
    );
  }
});

// {selectedPeople.map(function(person) {
//   return <Schedule person={person}
//                    timeFormat={this.props.timeFormat} />;
// }.bind(this))}
