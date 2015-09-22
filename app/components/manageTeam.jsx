var React = require('react');
var classNames = require('classnames');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');
var ActionCreators = require('../actions/actionCreators.js');
var Branding = require('./branding.jsx');
var Avatar = require('./avatar.jsx');
var EditPerson = require('./editPerson.jsx');
var userSort = require('../utils/transform').userSort;

module.exports = React.createClass({

  displayName: 'ManageTeam',

  getInitialState: function() {
    return {
      editingPerson: null,
      filterText: '',
      filter: null,
      inviteTeamMember: false
      // name: this.props.team.name
    };
  },

  handleClickClose: function(e) {
    AppDispatcher.dispatchViewAction({
      actionType: ActionTypes.SHOW_VIEW,
      value: 'app'
    });
  },

  // handleChange: function(name, value) {
  //   var newState = {};
  //   newState[name] = value;
  //   this.setState(newState);
  // },

  // handleClickSave: function(e) {
  //   AppDispatcher.dispatchViewAction({
  //     actionType: ActionTypes.SAVE_TEAM_INFO,
  //     value: this.state
  //   });
  // },

  handleClickUserEdit: function(person, e) {
    this.setState({ editingPerson: person, inviteTeamMember: false });
  },

  handleClickUserRemove: function(person, e) {
    if (confirm('Are you sure you want to delete?')) {
      ActionCreators.removeTeamMember(this.props.team._id, person._id);
    }
  },

  handleClickBackToMenu: function(e) {
    this.resetFilter();
    this.setState({ editingPerson: null });
  },

  handleClickAdd: function(e) {
    this.setState({ editingPerson: {}, inviteTeamMember: true });
  },

  handleFilterList: function(text) {
    this.setState({
      filterText: text,
      filter: new RegExp(text.toLowerCase(), 'i')
    });
  },

  resetFilter: function() {
    this.setState({
      filterText: '',
      filter: null
    });
  },

  peopleFilter: function(person) {
    return person.name && person.name.search(this.state.filter) > -1;
  },

  handleSelectText: function(e) {
    e.target.setSelectionRange(0, e.target.value.length);
  },

  render: function() {

    var people = this.props.people;
    var visiblePeople = this.state.filter ? people.filter(this.peopleFilter) : people;
    var sortedPeople = visiblePeople.sort(userSort);

    var filterValueLink = {
      value: this.state.filterText,
      requestChange: this.handleFilterList
    };

    var headerContent = {};

    if (this.props.justCreated) {
      headerContent.title = 'Getting started with ' + this.props.team.name;
      headerContent.body = (
        <div>
          <p>
            Here you can manage your team - inviting, editing and removing people as you need.
          </p>
          <p>
            When you're done, you can click the button below or the X at the top right.
            To get back here you can always click the "Manage Team" button at right on your team dashboard.
          </p>
          <p>
            Copy the unique invite url below and send it to your team or invite them manually.
            {' '}
            This will allow them to signup and add their own location.
          </p>
        </div>
      );
      headerContent.closeButton = 'Show me my team!';
    } else {
      headerContent.title = this.props.team.name;
      headerContent.body = (
        <p>
          Edit and invite members of your team here.
          {' '}
          Copy the unique invite url below and send it to your team or invite them manually.
        </p>
      );
      headerContent.closeButton = 'Go back to my team';
    }

    return (
      <div className="manage-team--container">

        <header className="manage-team--header">

          <Branding />

          <h2 className="manage-team--header-title">
            {headerContent.title}
          </h2>

          {headerContent.body}

          <div className="manage-team--row">
            <input type="text"
                   className="manage-team--invite-url"
                   readOnly={true}
                   onClick={this.handleSelectText}
                   value={this.props.team.inviteUrl} />
          </div>

          <div className="manage-team--row">
            <button className="cta"
               onClick={this.handleClickAdd}>
              Add a team member
            </button>
          </div>

          <div className="manage-team--row">
            <button onClick={this.handleClickClose}>
              {headerContent.closeButton}
            </button>
          </div>

        </header>

        <button className="manage-team--close circle clear material-icons"
                name="Close"
                onClick={this.handleClickClose}>
          clear
        </button>

        { !this.state.editingPerson ? (
            <div className="manage-team--subview manage-team--subview-team">

              <div className="manage-team--team-header">
                <input type="search"
                       valueLink={filterValueLink}
                       placeholder="Search" />
              </div>

              <div className="manage-team--team-list">

                {sortedPeople.map(function(person, idx) {
                  return (
                    <div key={idx}
                         className="manage-team--team-member">

                      <div className="manage-team--team-member-info">

                        <Avatar avatar={person.avatar}
                                size="mini" />

                              <span className="manage-team--team-member-name">
                          {person.name}
                        </span>
                        <span className="manage-team--team-member-location">
                          {person.location}
                        </span>

                      </div>

                      <div className="manage-team--team-member-actions">
                        { !person.isRegistered &&
                          <button className="circle clear material-icons md-18"
                                  name="Edit team member"
                                  onClick={this.handleClickUserEdit.bind(null, person)}>
                            edit
                          </button>
                        }
                        <button className="circle clear material-icons md-18"
                                name="Remove from Team"
                                onClick={this.handleClickUserRemove.bind(null, person)}>
                          clear
                        </button>
                      </div>

                    </div>
                  )
                }.bind(this))}

              </div>

            </div>
          ) : (
            <div className="manage-team--subview">
              <div className="manage-team--person">

                <button className="modal--back-button clear material-icons"
                        onClick={this.handleClickBackToMenu}>
                  arrow_back
                </button>

                <EditPerson {...this.state.editingPerson}
                            teamId={this.props.team._id}
                            inviteTeamMember={this.state.inviteTeamMember}
                            timeFormat={this.props.timeFormat} />

              </div>
            </div>
          )
        }

      </div>
    );
  }
});
