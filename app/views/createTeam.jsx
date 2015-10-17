var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');
var Header = require('../components/header.jsx');
var Footer = require('../components/footer.jsx');
var UserMenu = require('../components/userMenu.jsx');
var Notification = require('../components/notification.jsx');
var TeamCard = require('../components/TeamCard.jsx');

module.exports = React.createClass({

  displayName: 'CreateTeam',

  render: function() {

    var existingTeamCount = this.props.existingTeams ? this.props.existingTeams.length : 0;
    var hasExistingTeams = !!existingTeamCount;
    var thatTeam = existingTeamCount === 1 ? 'that team isn\'t' : 'those teams aren\'t';

    return (
      <div className="container">

        <Header {...this.props} />

        <div className="page-content">

          <h2>
            Create your team
          </h2>

          <Notification style="error"
                        text={this.props.errors} />

          {hasExistingTeams && (
            <div>
              <p>
                We found {this.props.existingTeams.length} existing teams with the same name,
                a person on your team may ahve already created your team on Timezone.io.
                Check them out below:
              </p>
              <div className="team-card-container">
                {this.props.existingTeams.map(function(team) {
                  return <TeamCard team={team} />;
                })}
              </div>
            </div>
          )}

          <form action="/team" method="post" className="">

            <input type="hidden" name="_csrf" value={this.props.csrf_token} />

            { hasExistingTeams ? (
              <p>If {thatTeam} your team, hit the button below to continue!</p>
            ) : (
              <p>First, name your team</p>
            )}

            <input type="text"
                   name="name"
                   placeholder="My awesome team"
                   defaultValue={this.props.name} />

            <p>Next, we'll ask you to add your team members</p>

            <button type="submit"
                    className="cta"
                    name="createSameName"
                    value={hasExistingTeams}>
              Let's do it
            </button>

          </form>

        </div>


      </div>
    );
  }
});
