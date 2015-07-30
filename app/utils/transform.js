var moment = require('moment-timezone');


function appendTime(time, person) {
  person.time = moment( time ).tz( person.tz );
  person.zone = person.time.zone();
}

function sortByTimezone(a, b){
  return b.time.zone() - a.time.zone();
}


module.exports = function transform(time, people) {

  // Append a moment date to each person
  people.forEach(appendTime.bind(null, time));
  people.sort(sortByTimezone);

  var timezones = people.reduce(function(zones, person){
    var last = zones[ zones.length - 1 ];
    var zone = last && last.people[0].zone;

    if (last && zone === person.zone) {
      last.people.push(person);
    } else {
      zones.push({
        tz: person.tz,
        people: [ person ]
      });
    }

    return zones;
  }, []);

  timezones.forEach(function(timezone){
    if (timezone.people.length / people.length > 0.2)
      timezone.major = true;
  });

  return timezones;

};
