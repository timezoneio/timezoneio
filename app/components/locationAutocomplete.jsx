var React = require('react');
var classNames = require('classnames');
var toolbelt = require('../utils/toolbelt.js');
var KEY = require('../helpers/keyConstants.js');
var ActionCreators = require('../actions/actionCreators.js');

class LocationAutocomplete extends React.Component {
  constructor() {
    this.state = {
      active: false,
      location: this.props.location || '',
      results: []
    };
  }

  componentWillReceiveProps(nextProps) {
    // If this component gets it's location cleared or sent a fresh location we update
    if (nextProps.clearLocation !== this.props.clearLocation)
      this.setState({ location: nextProps.location });
  }

  handleFocus() {
    this.setState({ active: true });
  }

  handleBlur() {

    if (this.blurTimeout)
      clearTimeout(this.blurTimeout);

    // Delay the close 200ms so a user can click an option
    this.blurTimeout = setTimeout(function() {
      this.setState({ active: false });
    }.bind(this), 200);
  }

  handleChange(value) {

    if (value.length)
      this.locationSearch(value);

    this.setState({ location: value });

    this.props.handleChange(value);
  }

  handleKeyDown(e) {
    switch (e.keyCode) {
      case KEY.UP:
        this.moveSelectionUp();
        break;
      case KEY.DOWN:
        this.moveSelectionDown();
        break;
      case KEY.ENTER:
        // Prevent form submit
        e.preventDefault();
        e.stopPropagation();
        this.makeSelection();
        break;
    }
  }

  moveSelectionUp() {
    var results = this.state.results;
    var idx = toolbelt.indexOf('isSelected', results);
    var newSelectionIdx = idx <= 0 ? results.length - 1 : idx - 1;

    if (idx > -1)
      results[idx].isSelected = false;

    results[newSelectionIdx].isSelected = true;

    this.setState({ results: results });
  }

  moveSelectionDown() {
    var results = this.state.results;
    var idx = toolbelt.indexOf('isSelected', results);
    var newSelectionIdx = (idx === -1 || idx === results.length) ? 0 : idx + 1;

    if (idx > -1)
      results[idx].isSelected = false;

    results[newSelectionIdx].isSelected = true;

    this.setState({ results: results });
  }

  makeSelection() {
    var idx = toolbelt.indexOf('isSelected', this.state.results);
    if (idx > -1) {
      var selected = this.state.results[idx];
      this.saveSelection(selected.name, selected.tz);
    }
  }

  saveSelection(name, tz) {

    // Pass it upwards
    this.props.handleChange(name, tz);

    // clear selected
    var results = this.state.results;
    var idx = toolbelt.indexOf('isSelected', results);
    if (idx > -1) results[idx].isSelected = false;

    this.setState({
      location: name,
      results: results,
      active: false
    });
  }

  locationSearch(value) {
    ActionCreators
      .locationSearch(value)
      .then(this.handleResults);
  }

  handleResults(results) {
    this.setState({ results: results });
  }

  handleSelectOption(option, e) {
    e.stopPropagation();
    this.saveSelection(option.name, option.tz);
  }

  renderOption(option, idx) {
    var classes = classNames('autocomplete--option', {
      selected: option.isSelected
    });
    return (
      <div key={idx}
           className={classes}
           onClick={this.handleSelectOption.bind(null, option)}>
        {option.value}
      </div>
    );
  }

  renderResults() {

    if ((this.state.location && this.state.location.length < 3) || !this.state.active)
      return '';

    return (
      <div className="autocomplete--results">
        {this.state.results.map(this.renderOption)}
      </div>
    );
  }

  render() {

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
}

module.exports = LocationAutocomplete
