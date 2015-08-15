/** @jsx React.DOM */

var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');
var Header = require('../components/header.jsx');
var Footer = require('../components/footer.jsx');
var UserMenu = require('../components/userMenu.jsx');

module.exports = React.createClass({

  displayName: 'CreateTeam',

  render: function() {
    return (
      <div className="container">

        <Header {...this.props} />

        <div className="page-content">

          <h2>
            Create your team
          </h2>

          <form action="/team" method="post" className="">

            <input type="hidden" name="_csrf" value={this.props.csrf_token} />

            { (this.props.errors && this.props.errors.length) ? (
                <p className="form-error">
                  {this.props.errors.join('<br>')}
                </p>
            ) : ''}

            <p>First, name your team</p>

            <input type="text"
                   name="name"
                   placeholder="My awesome team" />

            <p>Next, we'll ask you to add your team members</p>

            <button type="submit" className="cta">
              Let's do it
            </button>

          </form>

        </div>


      </div>
    );
  }
});
