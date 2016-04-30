var React = require('react');
var Header = require('../components/header.jsx');
var Footer = require('../components/footer.jsx');
var TimezoneList = require('../components/timezoneList.jsx');

var demoTimezones = [
  {
    tz: 'America/Los_Angeles',
    people: [
      {
        _id: '3',
        name: 'Mary',
        tz: 'America/Los_Angeles',
        location: 'San Francisco',
        avatar: '/images/avatars/mary.jpg'
      }
    ]
  },
  {
    tz: 'America/New_York',
    people: [
      {
        _id: '1',
        name: 'Dan',
        tz: 'America/New_York',
        location: 'New York',
        avatar: '/images/avatars/dan.jpg'
      },
      {
        _id: '2',
        name: 'Sunil',
        tz: 'America/New_York',
        location: 'DC',
        avatar: '/images/avatars/sunil.png'
      }
    ]
  },
  {
    tz: 'Europe/Rome',
    people: [
      {
        _id: '4',
        name: 'Carolyn',
        tz: 'Europe/Rome',
        location: 'Venice',
        avatar: 'http://www.gravatar.com/avatar/17d551ff33a7b03d93bbd1f8fa18d4f5?s=200'
      }
    ]
  }
];

var cities = [
  'London',
  'New York',
  'Santiago',
  'Melbourne',
  'Berlin',
  'Idaho',
  'Cape Town',
  'Osaka',
  'LA',
  'Chang Mai',
  'Ubud',
  'Bangalore',
  'Stockholm'
];

module.exports = React.createClass({

  displayName: 'Homepage',

  getInitialState: function() {
    return {
      timezones: demoTimezones,
      searchCities: cities,
      searchCityIdx: 0,
      searchCity: cities[0]
    };
  },
  showNextSearchCity: function() {

    var TYPE_DELAY = 100;
    var BACKSPACE_DELAY = 60;
    var CITY_DELAY = 1000;

    var backspace = function() {
      var partial = this.state.searchCity;
      if (!partial.length)
        return setTimeout(nextCity, BACKSPACE_DELAY);

      partial = partial.substr(0, partial.length - 1);
      this.setState({ searchCity: partial });
      setTimeout(backspace, BACKSPACE_DELAY);
    }.bind(this);

    var nextCity = function() {
      var nextIdx = this.state.searchCityIdx + 1 >= this.state.searchCities.length ?
                    0 :
                    this.state.searchCityIdx + 1;
      this.setState({ searchCityIdx: nextIdx });
      setTimeout(type, TYPE_DELAY);
    }.bind(this);

    var type = function() {
      var full = this.state.searchCities[this.state.searchCityIdx];
      if (this.state.searchCity === full)
        return setTimeout(backspace, CITY_DELAY);

      var partial = this.state.searchCity;
      partial = full.substr(0, partial.length + 1);
      this.setState({ searchCity: partial });
      setTimeout(type, TYPE_DELAY);
    }.bind(this);

    // Start it!
    backspace();
  },
  componentDidMount: function() {
    // Probably bad practice, but whatever
    setTimeout(this.showNextSearchCity, 2000);
  },
  render: function() {
    var honeyPotStyle = { "position": "absolute", "left": "-5000px" };
    return (
      <div className="container">

        <Header {...this.props}
                demo={true}
                link={false} />

        <div className="hp-section demo">

          <h2 className="hp-headline">
            Keep track where and <em>when</em> your team is.
          </h2>
          <div className="hp-demo">
            <TimezoneList time={this.props.time}
                          timeFormat={this.state.timeFormat}
                          timezones={this.state.timezones} />
          </div>

        </div>

        <div className="hp-section alt">

          <div className="hp-content-container hp-pitch-container">

            <h3 className="hp-pitch">
              Easily plan meetings + calls with your remote, nomadic team without having to Google <br/>
              <span className="hp-pitch-search">time in {this.state.searchCity}</span><br/>
              <em>...ever again.</em>
            </h3>

            <a href="/signup" className="button cta large">
              Sign up and create your team today!
            </a>

          </div>

        </div>

        <div className="hp-section">

          <div className="hp-content-container">

            <p className="hp-description">
              Modern global teams have awesome people spread across multiple timezones.
              Lots of teams have <em>digital nomads</em> changing locations faster than
              we can keep up with. Often it gets tricky to remember what time it is
              where your teammates are. Enter <strong>Timezone.io</strong>.
            </p>

            <h4 className="hp-description">
              Send your wants, needs and encouragement over to <a href="https://twitter.com/timezoneio">
              <strong>@timezoneio</strong> on Twitter</a>
            </h4>

            <div style={{ textAlign: 'center' }}>
              <a href="/signup" className="button cta">
                Sign up now!
              </a>
            </div>

          </div>

        </div>

        <Footer />

      </div>
    );
  }
});
