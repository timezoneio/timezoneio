/** @jsx React.DOM */

var React = require('react');
var classNames = require('classnames');
var ActionCreators = require('../actions/actionCreators.js');


module.exports = React.createClass({

  displayName: 'LocationAutocomplete',

  getInitialState: function() {
    return {
      active: false,
      location: this.props.location || '',
      results: []
    };
  },

  handleFocus: function() {
    this.setState({ active: true });
  },

  handleBlur: function() {

    if (this.blurTimeout)
      clearTimeout(this.blurTimeout);

    // Delay the close 200ms so a user can click an option
    this.blurTimeout = setTimeout(function() {
      this.setState({ active: false });
    }.bind(this), 200);
  },

  handleChange: function(value) {

    if (value.length)
      this.locationSearch(value);

    this.setState({ location: value });
  },

  handleKeyDown: function(e) {

  },

  locationSearch: function(value) {
    ActionCreators
      .locationSearch(value)
      .then(this.handleResults)
  },

  handleResults: function(results) {
    this.setState({ results: results });
  },

  handleSelectOption: function(option, e) {
    e.stopPropagation();

    // Pass it upwards
    this.props.handleChange(option.name, option.tz);

    this.setState({
      location: option.name,
      active: false
    });
  },

  renderOption: function(option, idx) {
    return (
      <div key={idx}
           className="autocomplete--option"
           onClick={this.handleSelectOption.bind(null, option)}>
        {option.value}
      </div>
    );
  },

  renderResults: function() {

    if (this.state.location.length < 3 || !this.state.active) return '';

    return (
      <div className="autocomplete--results">
        {this.state.results.map(this.renderOption)}
      </div>
    );
  },

  render: function() {

    var classes = classNames('autocomplete', {
      'active': this.state.active
    });

    var locationLink = {
      value: this.state.location,
      requestChange: this.handleChange
    };

    return (
      <div className={classes}>

        <input className="autocomplete--field"
               type="text"
               name="location"
               placeholder="Location"
               valueLink={locationLink}
               onKeyDown={this.handleKeyDown}
               onFocus={this.handleFocus}
               onBlur={this.handleBlur} />

        {this.renderResults()}

      </div>
    );
  }
});
