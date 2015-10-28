'use strict';
var React = require('react');
var ActionCreators = require('../actions/actionCreators');

class TeamSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state =  {
      isActive: false
    };
  }

  handleSearchChange(e) {
    ActionCreators.searchTeam(e.target.value);
  }

  render() {
    return (
      <div className="team-search">

        <input type="search"
               className="team-search-input"
               placeholder="Search"
               onChange={this.handleSearchChange} />

      </div>
    );
  }
}

module.exports = TeamSearch;
