var React = require('react');
var cx = require('react/lib/cx.js');
var timeUtils = require('../utils/time.js');

module.exports = React.createClass({
  render: function() {

    var person = this.props.person;
    var formatString = timeUtils.getShortFormatStringFor(this.props.timeFormat);
    var hours = timeUtils.getAvailableHoursInUTC(person.tz, formatString);

    return (
      <div className="schedule">
        <img src={person.avatar}
             className="avatar small"
             title={person.name} />
        <ul className="schedule--hours">
          {hours.map(function(hour, idx) {
            var classes = cx({
              'schedule--hour': true,
              'schedule--hour-available': hour.isAvailable
            });
            return (
              <li className={classes} key={'sch' + person.id + idx}>
                {hour.isAvailable ? hour.localTime : ''}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
});
