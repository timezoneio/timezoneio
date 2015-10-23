'use strict';
var React = require('react');
var Page = require('../components/Page.jsx');

class Contact extends React.Component {

  getMailTo() {
    if (typeof window === 'object')
      return 'mailto:hi@timezone.io';
    return '';
  }

  render() {
    return (
      <Page {...this.props}>
        <div className="content-container">
          <h1>Contact</h1>
          <p>
            Have an issue, a suggestion, some constructive criticism?<br/>
            Please reach out via
            {' '}<a href={this.getMailTo()}>Email</a> or
            {' '}<a href="https://twitter.com/timezoneio" target="_blank">Twitter</a>
          </p>
        </div>
      </Page>
    );
  }
}

module.exports = Contact;
