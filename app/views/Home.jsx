'use strict';
const React = require('react');
const pluralize = require('../utils/strings').pluralize;
const toolbelt = require('../utils/toolbelt');
const errorCodes = require('../helpers/errorCodes');
const Page = require('../components/Page');
const Avatar = require('../components/avatar');
const ProfileLocation = require('../components/profileLocation');
const TeamCard = require('../components/TeamCard');
const Notification = require('../components/notification');
const ActionCreators = require('../actions/actionCreators');

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      location: props.user.location,
      tz: props.user.tz,
      coords: props.user.coords,
      checkingLocation: false,
      error: null
    };
  }

  getLocationText() {
    return this.state.location || 'Click to set location';
  }

  updateUserLocation() {
    this.setState({ checkingLocation: true });

    ActionCreators.getUserLocationAndTimezone(this.state)
      .then((positionData) => {
        this.setState(toolbelt.extend({ checkingLocation: false }, positionData));
        this.saveProfile();
      })
      .catch((err) => {
        var newState = {
          checkingLocation: false
        };
        if (err.code === errorCodes.CITY_NOT_FOUND) {
          newState.error = `${err.message}, please manually enter your city`;
        }
        // TODO - Allow manual update
        this.setState(newState);
      });
  }

  saveProfile() {
    var saveData = toolbelt.pluck('name', 'avatar', 'location', 'tz', 'coords', this.state);

    ActionCreators.saveUserInfo(this.props.user._id, saveData)
      .then(
        () => this.setState({ error: '' }),
        (err) => this.setState({ error: err.message })
      );
  }

  render() {
    return (
      <Page {...this.props}>
        <div className="content-container home-container">

          <header className="home-header">

            <Avatar {...this.props.user} />

            <div className="home-header-center">

              <ProfileLocation
                location={this.getLocationText()}
                tz={this.state.tz}
                time={this.props.time}
                timeFormat={this.props.timeFormat}
                // error={locationError}
                loading={this.state.checkingLocation}
                onClick={this.handleToggleProfileEdit}
              />

            </div>

            <button className="hollow" onClick={this.updateUserLocation.bind(this)}>
              Update location
            </button>

          </header>

          <Notification
            style="error"
            text={this.state.error}
          />

          <h2>Your team{pluralize(this.props.teams)}</h2>

          <div className="team-card-container">
            {this.props.teams.map((team) => <TeamCard team={team} />)}
          </div>

        </div>
      </Page>
    );
  }
}

module.exports = Home;
