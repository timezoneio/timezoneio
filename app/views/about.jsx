var React = require('react');
var Header = require('../components/header.jsx');
var Footer = require('../components/footer.jsx');

module.exports = React.createClass({

  displayName: 'About',

  getInitialState: function() {
    return {};
  },

  getMailTo: function() {
    if (typeof window === 'object')
      return 'mailto:hi@timezone.io';
    return '';
  },

  render: function() {

    return (
      <div className="container ensure-full-height about-page">

        <Header {...this.props}
                demo={true} />

        <div className="hp-section">

          <h2 className="hp-headline">
            About
          </h2>

          <div className="hp-content-container"
               style={{ textAlign: 'center' }}>

            <p>
              Timezone.io was created by <a href="https://twitter.com/djfarrelly">Dan Farrelly</a><br/>
               while working on the amazing remote <a href="https://buffer.com">Buffer</a> team.
            </p>

            <p>
              Have a question, suggestion or criticism? <br/>
              <a href={this.getMailTo()}>Email</a> or <a href="https://twitter.com/timezoneio">Twitter</a>
            </p>

          </div>

        </div>


        <Footer />

      </div>
    );
  }
});
