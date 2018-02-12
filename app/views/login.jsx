var React = require('react');
var Header = require('../components/header.jsx');
var Notification = require('../components/notification.jsx');

module.exports = React.createClass({

  render: function() {

    return (
      <div className="container login-container">

        <Header {...this.props} />

        <h1 className="page-headline">Log in</h1>

        <Notification style="error"
                      text={this.props.errors} />

        <Notification style="success"
                      text={this.props.message} />

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
