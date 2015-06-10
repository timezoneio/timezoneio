/** @jsx React.DOM */

var React = require('react');
var ActionCreators = require('../actions/actionCreators.js');


module.exports = React.createClass({

  displayName: 'LocationAutocomplete',

  getInitialState: function() {
    return {
      location: this.props.location || '',
      results: []
    };
  },

  handleChange: function(value) {

    if (value.length)
      this.locationSearch(value);

    this.setState({ location: value });
  },

  locationSearch: function(value) {
    ActionCreators
      .locationSearch(value)
      .then(this.handleResults)
  },

  handleResults: function(results) {
    this.setState({ results: results });
  },

  handleSelectOption: function(e) {
    console.info('select!');
  },

  renderOption: function(option, idx) {
    return (
      <div key={idx}
           className="autocomplete--option"
           onClick={this.handleSelectOption}>
        {option.value}
      </div>
    );
  },

  renderResults: function() {
    // TODO - check if focused/active

    if (this.state.location.length < 3) return '';

    return this.state.results.map(this.renderOption)
  },

  render: function() {

    var locationLink = {
      value: this.state.location,
      requestChange: this.handleChange
    };


    return (
      <div className="autocomplete">

        <input className="autocomplete--field"
               type="text"
               name="location"
               valueLink={locationLink}
               placeholder="Location" />

        {this.renderResults()}

      </div>
    );
  }
});
