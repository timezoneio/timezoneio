'use strict';
var React = require('react');
var getProfileUrl = require('../helpers/urls').getProfileUrl;
var Header = require('../components/header.jsx');


class Admin extends React.Component {

  // TODO - Add sorting of teams
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     sort: this.props.teams
  //   }
  // }

  getAdminInfo(admins) {
    if (!admins.length)
      return 'No admin';

    return <a href={getProfileUrl(admins[0])}>admin</a>
  }

  render() {
    return (
      <div className="container login-container">

        <Header {...this.props} />

        <h1 className="page-headline">Admin</h1>

        <div className="page-content">

          <p>There are {this.props.numUsers} users on {this.props.teams.length} teams:</p>

          <div className="team-list">
            {this.props.teams.map(function(team) {
              return (
                <div className="team-list--team">
                  <a href={team.url}>{team.name}</a> has {team.people.length} team members ({this.getAdminInfo(team.admins)})
                </div>
              );
            }.bind(this))}
          </div>

        </div>

      </div>
    );
  }
}

module.exports = Admin;
