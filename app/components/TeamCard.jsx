'use strict';
var React = require('react');

class TeamCard extends React.Component {

  renderAdmin(admin) {
    return (
      <p className="team-card-info">
        Created by {admin.name}
      </p>
    );
  }

  render() {
    var team = this.props.team;
    return (
      <div className="team-card">
        <h3 className="team-card-name">
          <a href={team.url}>{team.name}</a>
        </h3>
        {team.admins.length ? this.renderAdmin(team.admins[0]) : ''}
      </div>
    );
  }
}

module.exports = TeamCard;
