'use strict';
var React = require('react');
var Page = require('../components/Page');
var Notification = require('../components/notification');
var CSRFToken = require('../components/CSRFToken');

class PasswordChange extends React.Component {
  render() {
    return (
      <Page {...this.props}>
        <div className="content-container">

          <h1>Change your Password</h1>

          <Notification
            style="error"
            text={this.props.errors}
          />

          <form method="post" className="login-form">

            <CSRFToken {...this.props} />

            <div className="form-row">
              <label>Type your current password:</label>
              <input type="password" name="currentPassword" placeholder="current password"/>
            </div>

            <div className="form-row">
              <label>Type your new password:</label>
              <input type="password" name="password" placeholder="new password"/>
            </div>

            <div className="form-row">
              <label>Please retype your new password:</label>
              <input type="password" name="password2" placeholder="password again"/>
            </div>

            <div className="form-row txt-center">
              <button type="submit">
                Submit
              </button>
            </div>

          </form>


          <p className="txt-center">
            Need help? <a href="/contact">Contact us</a>
          </p>

        </div>
      </Page>
    );
  }
}

module.exports = PasswordChange;
