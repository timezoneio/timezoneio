/** @jsx React.DOM */

var React = require('react');
var classNames = require('classnames');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');
var ActionCreators = require('../actions/actionCreators.js');
var Modal = require('./modal.jsx');
var Avatar = require('./avatar.jsx');
var EditPerson = require('./editPerson.jsx');

module.exports = React.createClass({

  displayName: 'ManageModal',

  getInitialState: function() {
    return {
      editingPerson: null,
      filter: null,
      // name: this.props.team.name
    };
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
    this.setState({ editingPerson: person, newUser: false });
  },

  handleClickUserRemove: function(person, e) {
    if (confirm('Are you sure you want to delete?')) {
      ActionCreators.removeTeamMember(this.props.team._id, person._id);
    }
  },

  handleClickBackToMenu: function(e) {
    this.setState({ editingPerson: null });
  },

  handleClickAdd: function(e) {
    this.setState({ editingPerson: {}, newUser: true });
  },

  handleFilterList: function(e) {
    this.setState({ filter: new RegExp(e.target.value.toLowerCase(), 'i') });
  },

  peopleFilter: function(person) {
    return person.name && person.name.search(this.state.filter) > -1;
  },

  peopleSort: function(a, b) {
    return a.name < b.name ? -1 : 1;
  },

  render: function() {

    var people = this.props.people;
    var visiblePeople = this.state.filter ? people.filter(this.peopleFilter) : people;
    var sortedPeople = visiblePeople.sort(this.peopleSort);

    return (
      <Modal>

        { !this.state.editingPerson ? (
            <div className="manage-modal--team">

              <div className="manage-modal--team-header">

                <input type="search"
                       onChange={this.handleFilterList}
                       placeholder="Search" />

                <button className="cta"
                        onClick={this.handleClickAdd}>
                  Add team member
                </button>

              </div>

              <div className="manage-modal--team-list">

                {sortedPeople.map(function(person, idx) {
                  return (
                    <div key={idx}
                         className="manage-modal--team-member">

                      <div className="manage-modal--team-member-info">

                        <Avatar avatar={person.avatar}
                                size="mini" />

                        <span className="manage-modal--team-member-name">
                          {person.name}
                        </span>
                        <span className="manage-modal--team-member-location">
                          {person.location}
                        </span>

                      </div>

                      <div className="manage-modal--team-member-actions">
                        <button className="circle clear material-icons md-18"
                                name="Edit team member"
                                onClick={this.handleClickUserEdit.bind(null, person)}>
                          edit
                        </button>
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
            <div className="manage-modal--person">

              <button className="modal--back-button clear material-icons"
                      onClick={this.handleClickBackToMenu}>
                arrow_back
              </button>

              <EditPerson {...this.state.editingPerson}
                          teamId={this.props.team._id}
                          isNewUser={this.state.newUser} />

            </div>
          )
        }

      </Modal>
    );
  }
});

        // <h2 className="modal-header">Manage</h2>

        // <label>Name</label>
        // <input name="name" type="text" valueLink={nameLink} />

        // <button onClick={this.handleClickSave}>
        //   Save
        // </button>
