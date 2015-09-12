/** @jsx React.DOM */

var React = require('react');
var Header = require('../components/header.jsx');
var getProfileUrl = require('../helpers/urls').getProfileUrl;

module.exports = React.createClass({

  renderLocation: function() {
    if (!this.props.user.location)
      return (
        <p>
          Finding your location & timezone information...
        </p>
      );

    return (
      <p>
        <span className="material-icons md-18">place</span>
        {this.props.user.location}
      </p>
    );
  },

  renderHiddenUserFields: function() {

    if (!this.props.user || !this.props.user.coords) return;

    return (
      <div>
        <input type="hidden" name="location" value={this.props.user.location} />
        <input type="hidden" name="tz" value={this.props.user.tz} />
        <input type="hidden" name="coords"
               value={this.props.user.coords.lat + ',' + this.props.user.coords.long} />
      </div>
    )
  },

  render: function() {

    return (
      <div className="container login-container">

        <Header {...this.props} />

        <h1 className="page-headline">Get started</h1>

        <form action={getProfileUrl(this.props.user)} method="post" className="login-form">

          <input type="hidden" name="_csrf" value={this.props.csrf_token} />

          <p>
            First, enter your name
          </p>

          <div>
            <input type="text"
                   name="name"
                   placeholder="your name"
                   defaultValue={this.props.user.name} />
          </div>

          {this.renderLocation()}

          {this.renderHiddenUserFields()}

          <div>
            <button type="submit" className="cta login-button">
              This is great, take me to my profile
            </button>
          </div>

        </form>


      </div>
    );
  }
});

// TODO
// <p>
//   First, choose a username, this will be for your personal url
//   <span className="muted"> - ex. timezone.io/people/bodhi</span>
// </p>
//
// <div>
//   <input type="text"
//          name="username"
//          placeholder="username"
//          defaultValue={this.props.user.username} />
// </div>
