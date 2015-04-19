/** @jsx React.DOM */

var React = require('react');
var Header = require('../components/header.jsx');

module.exports = React.createClass({

  render: function() {

    return (
      <div className="container login-container">

        <Header {...this.props} />

        <h1 className="page-headline">Login</h1>

        { this.props.errors ? <p>{this.props.errors.join(',')}</p> : '' }

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
              Login
            </button>
          </div>

        </form>


      </div>
    );
  }
});
