'use strict';

var React = require('react');
var Header = require('../components/header.jsx');
var Notification = require('../components/notification.jsx');

class Signup extends React.Component {

  renderHeadline() {
    if (!this.props.teamInvite)
      return <h1 className="page-headline">Sign up</h1>;

    return <h1 className="page-headline">Join {this.props.team.name} on Timezone.io!</h1>;
  }

  render() {

    return (
      <div className="container login-container">

        <Header {...this.props} />

        {this.renderHeadline()}

        <Notification style="error"
                      text={this.props.errors} />

        <form action="/signup" method="post" className="login-form">

          <input type="hidden" name="_csrf" value={this.props.csrf_token} />

          <div>
            <input type="email"
                   name="email"
                   placeholder="email"
                   defaultValue={this.props.email} />
          </div>

          <div>
            <input type="password"
                   name="password"
                   placeholder="password" />
          </div>

          <div>
            <input type="password"
                   name="password2"
                   placeholder="retype password" />
          </div>

          <p className="muted form-copy">
            Passwords should be at least 8 characters and contain a number
          </p>

          <div>
            <button type="submit" className="cta login-button">
              Sign up
            </button>
          </div>

          <p className="txt-center">
            Already have an account? <a href="/login">Log in here!</a>
          </p>

        </form>


      </div>
    );
  }
};

module.exports = Signup;
