/** @jsx React.DOM */

var React = require('react');
var classNames = require('classnames');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');
var Modal = require('./modal.jsx');
var Avatar = require('./avatar.jsx');
var EditPerson = require('./editPerson.jsx');

module.exports = React.createClass({

  displayName: 'ManageModal',

  getInitialState: function() {
    return {
      editingPerson: null
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

  handleClickBackToMenu: function(e) {
    this.setState({ editingPerson: null });
  },

  handleClickAdd: function(e) {
    console.info('add!');
    this.setState({ editingPerson: {}, newUser: true });
  },

  render: function() {

    // var nameLink = {
    //   value: this.state.name,
    //   requestChange: this.handleChange.bind(null, 'name')
    // };

    // TODO - Add search filter
    return (
      <Modal>

        { !this.state.editingPerson ? (
            <div className="manage-modal--team">

              <div className="manage-modal--team-header">

                <button className="cta"
                        onClick={this.handleClickAdd}>
                  Add team member
                </button>

              </div>

              <div className="manage-modal--team-list">

                {this.props.people.map(function(person, idx) {
                  return (
                    <div key={idx}
                         className="manage-modal--team-member">

                      <div className="manage-modal--team-member-info">

                        <Avatar avatar={person.avatar} />

                        <span className="manage-modal--team-member-name">
                          {person.name}
                        </span>
                        <span className="manage-modal--team-member-location">
                          {person.location}
                        </span>

                      </div>

                      <div className="manage-modal--team-member-actions">
                        <button className="circle material-icons md-18"
                                onClick={this.handleClickUserEdit.bind(null, person)}>
                          edit
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
