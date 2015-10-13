'use strict';
var React = require('react');

class CSRFToken extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <input type="hidden" name="_csrf" value={this.props.csrf_token} />;
  }

}

module.exports = CSRFToken;
