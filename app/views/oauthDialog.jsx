var React = require('react');
var Header = require('../components/header.jsx');
var Notification = require('../components/notification.jsx');
var CSRFToken = require('../components/CSRFToken.jsx')

module.exports = React.createClass({

  render: function() {

    return (
      <div className="container login-container">

        <Header {...this.props} />

        <h1 className="page-headline">Authorize Application</h1>

        <Notification style="error"
                      text={this.props.errors} />

        <form action="/oauth/authorize/decision" method="post" className="login-form">

          <p>
            The application "{this.props.client.name}" would like permission
            to access your account: <strong>{this.props.user.email}</strong>
          </p>

          <CSRFToken {...this.props} />

          <input type="hidden" name="transaction_id" value={this.props.transactionID} />

          <div>
            <button type="submit" className="cta login-button">
              Authorize Application
            </button>
          </div>

        </form>


      </div>
    );
  }
});
