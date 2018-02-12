'use strict';
var React = require('react');
var Page = require('../components/Page');
var Notification = require('../components/notification');
var CSRFToken = require('../components/CSRFToken');

class Account extends React.Component {

  constructor(props) {
    super(props);
    this.state =  {
      deleteAccountConfirmation: '',
    };
  }

  renderOption(name, option) {
    var id = `${name}-${option.value}`;
    return (
      <div className="form-row" key={id}>
        <label htmlFor={id} className="label-radio">
          <input
            type="radio"
            name={`settings[${name}]`}
            value={option.value}
            defaultChecked={this.props.userSettings[name] === option.value}
            id={id}
          />
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
        label: 'Only show my local time - hide my location for everyone but me',
        value: 'time-only'
      }
    ];

    return options.map(this.renderOption.bind(this, 'privacyLocation'));
  }

  handleDeleteAccountConfirmationChange(value) {
    this.setState({ deleteAccountConfirmation: value })
  }

  render() {
    var deleteAccountConfirmationLink = {
      value: this.state.deleteAccountConfirmation,
      requestChange: this.handleDeleteAccountConfirmationChange.bind(this)
    }
    return (
      <Page {...this.props}>
        <div className="content-container account-container">

          <Notification {...this.props} allowDismiss={true} />

          <h1>{this.props.title}</h1>

          <p>
            Change your basic account and privacy information
          </p>

          <form method="post" action="/account/delete">

            <CSRFToken {...this.props} />

            <div className="form-row">
              <label>Display name</label>
              <input type="text" name="name" defaultValue={this.props.user.name} />
            </div>

            <div className="form-row">
              <label>Email</label>
              <input type="email" name="email" defaultValue={this.props.user.email} />
            </div>

            <a href="/account/password" className="button">
              Change password
            </a>

            <h3>Time format</h3>

            {this.renderTimeFormat()}

            <h3>Location privacy</h3>

            {this.renderPrivacy()}

            <button className="cta" type="submit">
              Save changes
            </button>

          </form>

          <form method="post" action="/account/delete">

            <CSRFToken {...this.props} />

            <h3>Delete account</h3>

            <p>This is irreversible. All of your data will be deleted forever.</p>

            <div className="form-row">
              <label className="danger">Type DELETE to confirm</label>
              <input type="text" name="confirmation" valueLink={deleteAccountConfirmationLink} />
            </div>

            <div className="form-row">
              <label>Please share the reason why you're deleting your account (Optional)</label>
              <textarea name="reason" rows="2"></textarea>
            </div>

            <button
              className="danger"
              type="submit"
              disabled={this.state.deleteAccountConfirmation !== 'DELETE'}
            >
              Delete my account forever
            </button>

          </form>

        </div>
      </Page>
    );
  }
}

module.exports = Account;
