var React    = require('react');
var Timezone = require('./timezone.jsx');

const PEOPLE_PER_COL = 8;

var count = function(metric, people) {
  var items = people.reduce(function(list, p) {
    if (list.indexOf(p[metric].toLowerCase()) === -1)
      list.push(p[metric].toLowerCase());
    return list;
  }, []);
  return items.length;
};

module.exports = React.createClass({

  displayName: 'TimezoneList',

  getStats: function(people) {

    // Note the homepage doesn't provide people, only timezones
    if (!people || !Array.isArray(people)) return;

    var numPeople = people.length;
    var numCities = count('location', people);
    var numTimezones = this.props.timezones.length;

    return `${numPeople} people in ${numCities} cities across ${numTimezones} timezones`;
  },

  getColumnNumber: function(timezones) {
    return timezones.reduce(function(cols, timezone) {
      return cols + Math.ceil(timezone.people.length / PEOPLE_PER_COL);
    }, 0);
  },

  render: function() {

    var timeFormat = this.props.timeFormat || 12;

    var stats = this.getStats(this.props.people);
    var numCols = this.getColumnNumber(this.props.timezones);
    var sizeClass = 'timezone-list-' + (numCols > 10 ? 'wide' : 'normal');

    return (
      <div className={'timezone-list ' + sizeClass}>
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
