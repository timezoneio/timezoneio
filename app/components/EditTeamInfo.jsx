'use strict';
var React = require('react');
var ActionCreators = require('../actions/actionCreators.js');

class EditTeamInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      slug: props.slug
    };
  }

  handleChange(key, value) {
    var newState = {};
    newState[key] = value;
    this.setState(newState);
  }

  handleClickSave(e) {
    ActionCreators.saveTeamInfo(this.props._id, this.state);
  }

  handleClickDelete(e) {
    if (window.confirm(`Are you sure you want to delete ${this.state.name}`))
      ActionCreators.deleteTeam(this.props._id);
  }

  render() {

    var nameLink = {
      value: this.state.name,
      requestChange: this.handleChange.bind(this, 'name')
    };

    return (
      <div className="edit-person">
        <div className="edit-person--row">
          <label className="edit-person--label">
            Team name
          </label>
          <input type="text"
                 name="name"
                 valueLink={nameLink}
                 placeholder="Team name" />
        </div>

        <div className="edit-person--row">
          <button onClick={this.handleClickSave.bind(this)}>
            Save
          </button>
        </div>

        <div className="edit-person--row edit-info--danger">
          <label className="edit-person--label">
            Delete your team, this cannot be undone
          </label>
          <button className="danger"
                  onClick={this.handleClickDelete.bind(this)}>
            Delete {this.state.name}
          </button>
        </div>

      </div>
    )
  }

}

module.exports = EditTeamInfo;
