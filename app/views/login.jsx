var React = require('react');
var Header = require('../components/header.jsx');
var Notification = require('../components/notification.jsx');

var postCrash = [
  `Hi there!`,
  ``,
  `
  I'm sorry to report that Timezone had an irrecoverable data loss Monday, Novemeber
  9th and all login and team data was lost. Timezone has been rebuilt with a brand
  new data infrastructure with frequent backups to prevent a loss like this again.
  If you had an account before then, please click the "Sign up now" link below to
  create a new account - Thanks for your understanding!
  `,
  `- Dan`
];

module.exports = React.createClass({

  render: function() {

    return (
      <div className="container login-container">

        <Header {...this.props} />

        <h1 className="page-headline">Log in</h1>

        <Notification style="error"
                      text={this.props.errors} />

        <Notification
          style="notice"
          text={postCrash}
        />

        <form action="/login" method="post" className="login-form">

          <input type="hidden" name="_csrf" value={this.props.csrf_token} />

          <div>
            <input type="email"
                   name="email"
                   placeholder="email" />
          </div>

          <div>
            <input type="password"
                   name="password"
                   placeholder="password" />
          </div>

          <div>
            <button type="submit" className="cta login-button">
              Log in
            </button>
          </div>

          <p className="txt-center">
            Don't have an account? <a href="/signup">Sign up now!</a>
          </p>

          <p className="txt-center">
            Forgot your password? <a href="/account/request-password-reset">Click here</a>
          </p>

        </form>


      </div>
    );
  }
});
