'use strict';
var React = require('react');
var Page = require('../components/Page.jsx');

class Error extends React.Component {

  renderErrorStack(stack) {
    return stack
      .split('\n')
      .map(function(line) {
        return <div className="error-stack-line">{line}</div>;
      });
  }

  render() {
    return (
      <Page {...this.props}>
        <div className="content-container">
          <h1>{this.props.type}</h1>
          {this.renderErrorStack(this.props.error)}
        </div>
      </Page>
    );
  }
}

module.exports = Error;
