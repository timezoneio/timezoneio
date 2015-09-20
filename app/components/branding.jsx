var React = require('react');

module.exports = React.createClass({

  displayName: 'Branding',
  
  render: function() {
    var branding = <h1 className="site-branding">Timezone.io</h1>;

    if (this.props.link)
      return <a href="/" className="site-branding-link">{branding}</a>;

    return branding;
  }
});
