/** @jsx React.DOM */

var React = require('react');
var Header = require('../components/header.jsx');
var Footer = require('../components/footer.jsx');

module.exports = React.createClass({

  displayName: 'Roadmap',

  getInitialState: function() {
    return {};
  },

  render: function() {

    return (
      <div className="container ensure-full-height roadmap-page">

        <Header {...this.props}
                demo={true} />

        <div className="hp-section">

          <h2 className="hp-headline">
            Transparent Roadmap
          </h2>

          <p style={{ textAlign: 'center' }}>
            This is Timezone.io's incomplete to do list.
          </p>

          <div class="roadmap-list">

            <div className="roadmap-item">
              New User sign up
            </div>

            <div className="roadmap-item">
              Team creation
            </div>

            <div className="roadmap-item">
              Meeting time suggestor / planner
            </div>

            <div className="roadmap-item">
              Invite your team
            </div>

            <div className="roadmap-item">
              Automatic user location detection
            </div>

            <div className="roadmap-item">
              Track log of location changes
            </div>

            <div className="roadmap-item">
              New Homepage
            </div>

          </div>

        </div>


        <Footer />

      </div>
    );
  }
});
