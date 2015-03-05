/** @jsx React.DOM */

var React = require('react');
var Schedule = require('./schedule.jsx');

module.exports = React.createClass({
  renderEmpty: function() {
    return (
      <p className="text-small text-centered">
        Click someone to start <br/>
        planning a meeting!
      </p>
    );
  },
  render: function() {

    // TODO make sure sorted by timezone :)
    var selectedPeople = this.props.people.filter(function(person) {
      return person.isSelected;
    });

    if (!selectedPeople.length) return this.renderEmpty();

    // var commonScheduleRows =

    return (
      <table className="meeting-planner">
        <tr>
          {selectedPeople.map(function(person) {
            return (
              <th>
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