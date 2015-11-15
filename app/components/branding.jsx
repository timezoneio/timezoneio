'use strict';
var React = require('react');

class Branding extends React.Component {

  render() {
    var classes = 'site-branding' + (this.props.minimal ? ' minimal' : '');
    var branding = <h1 className={classes}>Timezone.io</h1>;

    if (this.props.link)
      return <a href="/" className="site-branding-link">{branding}</a>;

    return branding;
  }
}

module.exports = Branding;
