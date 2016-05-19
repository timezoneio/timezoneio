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
    var admin = this.admins && this.admins.length && this.admins[0];
    return (
      <div className="team-card">
        <h3 className="team-card-name">
          <a href={team.url}>{team.name}</a>
        </h3>
        {admin && this.renderAdmin(admin)}
      </div>
    );
  }
}

module.exports = TeamCard;
