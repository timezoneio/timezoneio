/** @jsx React.DOM */

var React = require('react');
var AppDispatcher = require('../dispatchers/appDispatcher.js');
var ActionTypes = require('../actions/actionTypes.js');
var Modal = require('./modal.jsx');
var EditPerson = require('./editPerson.jsx');

module.exports = React.createClass({

  displayName: 'ManageModal',

  getInitialState: function() {
    return {
      name: this.props.team.name
    }
  },

  handleChange: function(name, value) {
    var newState = {};
    newState[name] = value;
    this.setState(newState);
  },

  handleClickSave: function(e) {
    AppDispatcher.handleViewAction({
      actionType: ActionTypes.SAVE_TEAM_INFO,
      value: this.state
    });
  },

  render: function() {

    // var nameLink = {
    //   value: this.state.name,
    //   requestChange: this.handleChange.bind(null, 'name')
    // };
    var team = this.props.team;

    return (
      <Modal>
        {this.props.people.map(function(person, idx) {
          return <EditPerson key={idx}
                             {...person}
                             team={team} />
        })}
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
