'use strict';
var React = require('react');
var Header = require('../components/header.jsx');
var Footer = require('../components/footer.jsx');

class Page extends React.Component {

  render() {
    return (
      <div className="container ensure-full-height">

        <Header {...this.props}
                demo={true} />

        {this.props.children}

        <Footer />

      </div>
    );
  }
}

module.exports = Page;
