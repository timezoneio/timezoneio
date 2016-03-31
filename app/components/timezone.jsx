var React = require('react');
var moment = require('moment-timezone');
var Person = require('./person.jsx');
var timeUtils = require('../utils/time.js');

var PEOPLE_PER_COL = 8;

module.exports = React.createClass({

  displayName: 'Timezone',

  getCountsOf: function(list, param) {
    return list
      .map(function(el) {
        return el[param];
      })
      .sort()
      .reduce(function(counts, el) {
        if (!counts[el])
          counts[el] = 1;
        else
          counts[el]++;
        return counts;
      }, {});
  },

  getHighestOccurring: function(counts) {
    var keys = Object.keys(counts);
    return keys.reduce(function(prev, curr){
      return counts[curr] > counts[prev] ? curr : prev;
    }, keys[0]);
  },

  getTopTimezone: function() {

    var tzCounts = this.getCountsOf(this.props.timezone.people, 'tz');
    var topTz = this.getHighestOccurring(tzCounts);

    return topTz.replace(/.+\//g, '').replace(/_/g,' ');
  },

  getTopCity: function() {

    var cityCounts = this.getCountsOf(this.props.timezone.people, 'location');
    var topCity = this.getHighestOccurring(cityCounts);

    return cityCounts[topCity] === 1 && this.props.timezone.people.length > 1 ?
      this.getTopTimezone() :
      topCity;
  },

  isHighlighted: function(person) {
    if (!this.props.activeFilter)
      return false;

    return person.name.search(this.props.activeFilter) > -1;
  },

  getPeopleColumns: function(people) {

    var numPeople = people.length;
    var numCols = Math.ceil(numPeople / PEOPLE_PER_COL);
    var numPerCol = Math.ceil(numPeople / numCols);

    return people.reduce(function(cols, person){
      if (cols[cols.length - 1] &&
          cols[cols.length - 1].length  < numPerCol)
        cols[cols.length - 1].push(person);
      else
        cols.push([ person ]);
      return cols;
    }, []);
  },

  render: function() {

    // We clone the time object itself so the this time is bound to
    // the global app time
    var localTime   = moment( this.props.time ).tz( this.props.timezone.tz );
    var fmtString   = timeUtils.getFormatStringFor(this.props.timeFormat);
    var displayTime = localTime ? localTime.format(fmtString) : 'Unknown';
    var offset      = localTime ? localTime.format('Z') : '??:??';
    var hour        = localTime ? localTime.hour() : 'unknown';

    var timezoneClasses = 'timezone timezone-hour-' + hour;

    if (this.props.timezone.major) timezoneClasses += ' timezone-major';

    var topCity = this.getTopCity() || 'Add location';
    var columns = this.getPeopleColumns(this.props.timezone.people);

    return (
      <div className={timezoneClasses}>
        <div className="timezone-header">
          <h3 className="timezone-time">{displayTime}</h3>
          <p className="timezone-name">{topCity}</p>
          <p className="timezone-offset">{offset}</p>
        </div>
        <div className="timezone-people">
          {columns.map(function(column, idx){
            return (
              <div className="timezone-people-column" key={"column-" + idx}>
                {column.map(function(person) {
                  return <Person key={person._id}
                                 person={person}
                                 isHighlighted={this.isHighlighted(person)} />;
                }.bind(this))}
              </div>
            );
          }.bind(this))}
        </div>
      </div>
    );
  }
});
