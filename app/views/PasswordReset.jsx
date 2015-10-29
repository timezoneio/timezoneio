'use strict';
var React = require('react');
var Page = require('../components/Page');
var CSRFToken = require('../components/CSRFToken');
var Notification = require('../components/notification');

class PasswordReset extends React.Component {

  renderRequestForm() {
    if (this.props.success)
      return (
        <p>
          We've just sent you an email. Click the link in the email to reset your password!<br/>
          If you don't see the email, try checking a spam folder.
        </p>
      );

    return (
      <div>

        <p>
          Enter your email that you use to for Timezone and we'll <br />send you
          and email with a link to reset your password!
        </p>

        <Notification style="error"
                      text={this.props.errors} />

        <form action="/account/request-password-reset" method="post" className="login-form">

          <CSRFToken {...this.props} />

          <div className="form-row">
            <input type="email" name="email" placeholder="Your email" />
          </div>

          <div className="form-row txt-center">
            <button type="submit">
              Send reset email
            </button>
          </div>

        </form>
      </div>
    );
  }

  renderResetForm() {
    return (
      <div>

        { (!this.props.errors || !this.props.errors.length) && (
          <p>
            Awesome! Enter a new password below and we'll update<br/>
            your account then log you into Timezone.
          </p>
        )}

        <Notification style="error"
                      text={this.props.errors} />

        { !this.props.hideForm && (
          <form action="/account/password-reset" method="post" className="login-form">

            <CSRFToken {...this.props} />

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
                Submit & Login
              </button>
            </div>

          </form>
        )}

      </div>
    );
  }

  render() {
    return (
      <Page {...this.props}>
        <div className="content-container">

          <h1>Reset your Password</h1>

          { this.props.requestReset ?
            this.renderRequestForm() :
            this.renderResetForm()
          }

          <p className="txt-center">
            Need help? <a href="/contact">Contact us</a>
          </p>

        </div>
      </Page>
    );
  }
}

module.exports = PasswordReset;
