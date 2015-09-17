var React = require('react');

var links = [
  {
    url: '/about',
    text: 'About'
  },
  {
    url: '/team/buffer',
    text: 'Demo'
  },
  {
    url: '/login',
    text: 'Login'
  },
  {
    url: '/roadmap',
    text: 'Roadmap'
  },
];


module.exports = React.createClass({

  displayName: 'Footer',

  getInitialState: function() {
    return {
      links: links
    };
  },

  render: function() {

    var year = new Date().getFullYear();

    return (
      <footer className="hp-section site-footer">

        <div className="hp-content-container">

          <p>
            © {year} Timezone.io <br/>
          </p>
          <p>
            {this.state.links.map(function(link, idx) {
              return (
                <a key={idx}
                   href={link.url}
                   className="footer-link">
                  {link.text}
                </a>
              );
            })}
          </p>

        </div>

      </footer>
    );
  }
});
