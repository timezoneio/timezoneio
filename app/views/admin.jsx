'use strict';
var React = require('react');
var getProfileUrl = require('../helpers/urls').getProfileUrl;
var Header = require('../components/header.jsx');
var getProfileUrl = require('../helpers/urls').getProfileUrl;
var api = require('../helpers/api');


class Admin extends React.Component {

  // TODO - Add sorting of teams
  constructor(props) {
    super(props);
    this.state = {
      people: this.props.people
    };
  }

  getAdminInfo(admins) {
    if (!admins.length) return 'No admin';
    return <a href={getProfileUrl(admins[0])}>admin</a>
  }

  getTeamApiEndpoint(team) {
    return `/api/team/${team._id}`;
  }

  getUserApiEndpoint(user) {
    return `/api/user/${user._id}`;
  }

  handleDeleteUserAccount(user, e) {
    e.preventDefault();
    var shouldDelete = window.confirm(`Are you sure you want to delete ${user.name}?`)

    if (shouldDelete) {
      api.delete(`/users/${user._id}`)
        .then(function(res) {
          // find user in state and mark it deleted

        }.bind(this), function(err) {
          console.error(err);
          alert('Failed to delete user');
        })
    }
  }

  render() {
    return (
      <div className="container login-container">

        <Header {...this.props} />

        <h1 className="page-headline">Admin</h1>

        <div className="page-content">

          <form action="/admin">
            <input type="text" name="search" placeholder="search" />
            <button type="submit">
              Search
            </button>
          </form>

          { this.props.teams && (
            <div>
              <p>There are {this.props.numUsers} users on {this.props.teams.length} teams</p>

              <div className="team-list">
                {this.props.teams.map(function(team, idx) {
                  return (
                    <div className="team-list--team" key={idx}>
                      <a href={team.url}>{team.name}</a> has {team.people.length} team members
                      {' '}- {this.getAdminInfo(team.admins)}
                      {' '}- <a href={this.getTeamApiEndpoint(team)} target="_blank">debug</a>
                    </div>
                  );
                }.bind(this))}
              </div>
            </div>
          ) }

          { this.state.users && (
            <div>
              <p>Found {this.state.users.length} matching users</p>

              <div className="team-list">
                {this.state.users.map(function(user, idx) {
                  return (
                    <div className="team-list--team" key={idx}>
                      <a href={getProfileUrl(user)}>{user.name}</a> is
                      {' '}- <a href={this.getUserApiEndpoint(user)} target="_blank">debug</a>
                      {' '}- <a href="#" onClick={this.handleDeleteUserAccount.bind(this, user)}>delete</a>
                    </div>
                  );
                }.bind(this))}
              </div>
            </div>
          ) }

        </div>

      </div>
    );
  }
}

module.exports = Admin;
