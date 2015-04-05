/** @jsx React.DOM */

var React = require('react');
var Header = require('../components/header.jsx');

module.exports = React.createClass({

  render: function() {

    return (
      <div className="container login-container">

        <Header />

        <h1>Login</h1>

        <form action="/login" method="post">

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
            <button type="submit">
              Login
            </button>
          </div>

        </form>


      </div>
    );
  }
});