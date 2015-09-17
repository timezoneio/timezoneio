var React = require('react');
var moment = require('moment-timezone');
var Person = require('./person.jsx');
var timeUtils = require('../utils/time.js');

var PEOPLE_PER_COL = 8;

module.exports = React.createClass({

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

  getHighestOccuring: function(counts) {
    var keys = Object.keys(counts);
    return keys.reduce(function(prev, curr){
      return counts[curr] > counts[prev] ? curr : prev;
    }, keys[0]);
  },

  getTopTimezone: function() {

    var tzCounts = this.getCountsOf(this.props.model.people, 'tz');
    var topTz = this.getHighestOccuring(tzCounts);

    return topTz.replace(/.+\//g, '').replace(/_/g,' ');
  },

  getTopCity: function() {

    var cityCounts = this.getCountsOf(this.props.model.people, 'location');
    var topCity = this.getHighestOccuring(cityCounts);

    return cityCounts[topCity] === 1 && this.props.model.people.length > 1 ?
      this.getTopTimezone() :
      topCity;
  },

  getPeopleColumns: function() {

    var numPeople = this.props.model.people.length;
    var numCols = Math.ceil(numPeople / PEOPLE_PER_COL);
    var numPerCol = Math.ceil(numPeople / numCols);

    return this.props.model.people.reduce(function(cols, person){
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
    var localTime   = moment( this.props.time ).tz( this.props.model.tz );
    var fmtString   = timeUtils.getFormatStringFor(this.props.timeFormat);
    var displayTime = localTime.format(fmtString);
    var offset      = localTime.format('Z');

    var timezoneClasses = 'timezone timezone-hour-' + localTime.hour();

    if (this.props.model.major) timezoneClasses += ' timezone-major';

    var topCity = this.getTopCity();
    var columns = this.getPeopleColumns();

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
                  return <Person model={person} key={person._id} />;
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
});
