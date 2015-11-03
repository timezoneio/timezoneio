'use strict';
var React = require('react');
var Page = require('../components/Page');

class Account extends React.Component {

  renderOption(name, option, idx) {
    var id = `${name}-${option.value}`;
    return (
      <div className="form-row">
        <label htmlFor={id} className="label-radio">
          <input type="radio"
                 name={name}
                 value={option.value}
                 checked={this.props.userSettings[name] === option.value}
                 id={id} />
          {option.label}
        </label>
      </div>
    );
  }

  renderTimeFormat() {
    var options = [
      {
        label: 'Twelve hour - ex. 1:17pm',
        value: 12
      },
      {
        label: 'Twenty four hour - ex. 13:17',
        value: 24
      }
    ];

    return options.map(this.renderOption.bind(this, 'timeFormat'));
  }

  renderPrivacy() {
    var options = [
      {
        label: 'Show my location (city/town) to anyone',
        value: 'public'
      },
      {
        label: 'Show my location to my team(s) only',
        value: 'team'
      },
      {
        label: 'Only show my local time. Hide my location for everyone but me',
        value: 'time-only'
      }
    ];

    return options.map(this.renderOption.bind(this, 'privacyLocation'));
  }

  render() {
    return (
      <Page {...this.props}>
        <div className="content-container account-container">
          <h1>{this.props.title}</h1>

          <p>
            Change your basic account and privacy information
          </p>

          <form>

            <div className="form-row">
              <label>Display name</label>
              <input type="text" name="name" defaultValue={this.props.user.name} />
            </div>

            <div className="form-row">
              <label>Email</label>
              <input type="email" name="email" defaultValue={this.props.user.email} />
            </div>

            <h3>Time format</h3>

            {this.renderTimeFormat()}

            <h3>Location privacy</h3>

            {this.renderPrivacy()}

            <button className="cta" type="submit">
              Save changes
            </button>

          </form>
        </div>
      </Page>
    );
  }
}

module.exports = Account;
