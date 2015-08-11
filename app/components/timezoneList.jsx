/** @jsx React.DOM */

var React    = require('react');
var Timezone = require('./timezone.jsx');

module.exports = React.createClass({

  displayName: 'TimezoneList',

  getStats: function(people) {

    // Note the homepage doesn't provide people, only timezones
    if (!people || !Array.isArray(people)) return;

    var cities = people.reduce(function(list, p) {
      if (list.indexOf(p.location.toLowerCase()) === -1)
        list.push(p.location.toLowerCase());
      return list;
    }, []);

    return people.length + ' people in ' + cities.length + ' cities';
  },

  render: function() {

    var timeFormat = this.props.timeFormat || 12;

    var stats = this.getStats(this.props.people);

    return (
      <div className="timezone-list">
        {this.props.timezones.map(function(timezone){
          return <Timezone key={timezone.tz}
                           time={this.props.time}
                           timeFormat={timeFormat}
                           model={timezone} />
        }.bind(this))}
        { this.props.showStats &&
          <div className="team-stats"><em>{stats}</em></div>
        }
      </div>
    );
  }

});
