'use strict';
var React = require('react');
var moment = require('moment-timezone');
var getProfileUrl = require('../helpers/urls').getProfileUrl;
var api = require('../helpers/api');
var Header = require('../components/header.jsx');
var Notification = require('../components/notification.jsx');
var Avatar = require('../components/avatar.jsx');
var CSRFToken = require('../components/CSRFToken.jsx');

var getUserAdminUrl = function(user) {
  return `/admin/user/${user._id}`;
};

var getUserApiEndpoint = function(user) {
  return `/api/user/${user._id}`;
};

var getTeamApiEndpoint = function(team) {
  return `/api/team/${team._id}`;
};

// {' '}- <a href="#" onClick={this.handleDeleteUserAccount.bind(this, user)}>delete</a>


class Admin extends React.Component {

  // TODO - Add sorting of teams
  constructor(props) {
    super(props);
    this.state = {
      message: this.props.message,
      users: this.props.users
    };
  }

  getAdminInfo(admins) {
    if (!admins.length) return 'No admin';
    return <a href={getProfileUrl(admins[0])}
              target="_blank"
              className="admin-list--action">admin</a>;
  }

  handleDeleteUserAccount(user) {

    var shouldDelete = window.confirm(`Are you sure you want to delete ${user.name}?`)

    if (shouldDelete) {
      api.delete(`/user/${user._id}`)
        .then(function(res) {
          // find user in state and mark it deleted
          this.setState({ message: 'User has been successfully deleted' });
        }.bind(this), function(err) {
          console.error(err);
          alert('Failed to delete user');
        })
    }
  }

  renderCopy() {
    if (this.props.numUsers)
      return `
        There are ${this.props.numUsers} (${this.props.numRegisteredUsers} registered) users
        on ${this.props.teams.length} teams
      `;

    if (this.props.manageUser)
      return `
        ${this.props.manageUser.name} is on ${this.props.teams.length} teams and
        is ${!this.props.manageUser.isRegistered && 'not'} registered
      `;

    return;
  }

  renderDate(dateString) {
    var m = moment(dateString);
    return `${m.fromNow()} (${m.format('ddd MMM Do [at] h:mm a')})`
  }

  render() {
    return (
      <div className="container">

        <Header {...this.props} />

        <h1 className="page-headline">Admin</h1>
        <p className="txt-center">
          <a href="/admin">Home</a> - <a href="/admin/teams">Teams</a> - <a href="/admin/users">Users</a>
        </p>

        <Notification text={this.state.message}
                      style={this.props.error && 'error'} />

        <div className="admin-content">

          <form action="/admin/users">
            <input type="text" name="search" placeholder="search" autoComplete="off" />
            <button type="submit">
              Search
            </button>
          </form>

          { this.props.manageUser && (
            <div className="admin-section">
              <Avatar avatar={this.props.manageUser.avatar} />
              <h2>{this.props.manageUser.name}</h2>
              <p><strong>Email: </strong>{this.props.manageUser.email}</p>
              <p><strong>Location: </strong>{this.props.manageUser.location}</p>
              <p><strong>tz: </strong>{this.props.manageUser.tz}</p>
              <p><strong>coords: </strong>{JSON.stringify(this.props.manageUser.coords)}</p>
              <p><strong>Avatar: </strong>{this.props.manageUser.avatar}</p>
              <p><strong>Created: </strong>{this.renderDate(this.props.manageUser.createdAt)}</p>
              <p><strong>Updated: </strong>{this.renderDate(this.props.manageUser.updatedAt)}</p>
              <button onClick={this.handleDeleteUserAccount.bind(this, this.props.manageUser)}
                      className="danger">
                Delete user account
              </button>

              <div className="admin-section">
                <form action={`/admin/user/${this.props.manageUser._id}`}
                      method="post">
                  <CSRFToken {...this.props} />
                  <input type="text" name="password" placeholder="password" />
                  <button type="submit"
                          className="danger">
                    Update password
                  </button>
                </form>
              </div>
            </div>
          ) }

          <p>{this.renderCopy()}</p>

          { this.props.teams && (
            <div>
              <div className="admin-list">
                {this.props.teams.map(function(team, idx) {
                  return (
                    <div className="admin-list--item" key={idx}>
                      <div className="admin-list--name">
                        <a href={team.url}>{team.name || 'No name'}</a>
                        {' '}has {team.people.length} team members
                      </div>
                      {this.getAdminInfo(team.admins)}
                      <a href={getTeamApiEndpoint(team)}
                         target="_blank"
                         className="admin-list--action">debug</a>
                    </div>
                  );
                }.bind(this))}
              </div>
            </div>
          ) }

          { this.state.users && (
            <div>
              <p>Found {this.state.users.length} matching users</p>

              <div className="admin-list">
                {this.state.users.map(function(user, idx) {
                  return (
                    <div className="admin-list--item" key={idx}>
                      <div className="admin-list--name">
                        <a href={getUserAdminUrl(user)}>{user.name || 'No name'}</a>
                        {' '}{user.email}
                      </div>
                      <a href={getProfileUrl(user)}
                         target="_blank"
                         className="admin-list--action">profile</a>
                      <a href={getUserApiEndpoint(user)}
                         target="_blank"
                         className="admin-list--action">debug</a>
                    </div>
                  );
                }.bind(this))}
              </div>
            </div>
          ) }

            <p>
              { this.props.prevPage && (
                <a href={this.props.baseUrl + '?p=' + this.props.prevPage}>Prev page</a>
              ) }
              { this.props.prevPage && this.props.nextPage && ' - ' }
              { this.props.nextPage && (
                <a href={this.props.baseUrl + '?p=' + this.props.nextPage}>Next page</a>
              ) }
            </p>


        </div>

      </div>
    );
  }
}

module.exports = Admin;
