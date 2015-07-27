/** @jsx React.DOM */

var React = require('react');
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

    if (!this.props.people || !this.props.people.length)
      return this.renderEmpty();

    // var commonScheduleRows =

    // TODO make sure sorted by timezone :)
    return (
      <table className="meeting-planner">
        <tr>
          {this.props.people.map(function(person, idx) {
            return (
              <th key={idx}>
                <img src={person.avatar}
                   className="avatar small"
                   title={person.name} />
              </th>
            );
          })}
        </tr>

      </table>
    );
  }
});

// {selectedPeople.map(function(person) {
//   return <Schedule person={person}
//                    timeFormat={this.props.timeFormat} />;
// }.bind(this))}
