'use strict';
var React = require('react');
var Page = require('../components/Page.jsx');

class Contact extends React.Component {

  getMailTo() {
    if (typeof window === 'object')
      return 'mailto:timezone.io.app@gmail.com';
    return '';
  }

  render() {
    return (
      <Page {...this.props}>
        <div className="content-container">
          <h1>Contact</h1>
          <p>
            Have an issue, a suggestion, some constructive criticism?
          </p>
          <p>
            Reach out via <a href={this.getMailTo()}>Email</a>,
            {' '}<a href="https://twitter.com/timezoneio" target="_blank">Twitter</a> or...
          </p>
          <p>
            <a href="https://github.com/timezoneio/timezoneio/issues" target="_blank">
              Report a bug or suggest a feature directly on Github
            </a>
          </p>
        </div>
      </Page>
    );
  }
}

module.exports = Contact;
