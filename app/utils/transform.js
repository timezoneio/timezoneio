var moment = require('moment-timezone');


function appendTime(time, person) {
  if (person.tz) {
    person.time = moment( time ).tz( person.tz );
    person.utcOffset = person.time.utcOffset();
  } else {
    person.time = null;
    person.utcOffset = 720; // make this display all the way to the right
  }
}

function sortByTimezone(a, b){
  return a.utcOffset - b.utcOffset;
}

function sortByNameAndId(a, b) {
  return a.name > b.name ? 1 :
         a.name !== b.name ? -1 :
         a._id > b._id ? 1 :
         -1;
}


 var transform = function(time, people) {

  // Append a moment date to each person
  people.forEach(appendTime.bind(null, time));
  people.sort(sortByTimezone);

  var timezones = people.reduce(function(zones, person){
    var last = zones[ zones.length - 1 ];
    var utcOffset = last && last.people[0].utcOffset;

    if (last && utcOffset === person.utcOffset) {
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
    timezone.people.sort(sortByNameAndId);

    if (timezone.people.length / people.length > 0.2)
      timezone.major = true;
  });

  return timezones;

};

transform.userSort = sortByNameAndId;

module.exports = transform;
