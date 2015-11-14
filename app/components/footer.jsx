var React = require('react');

var links = [
  {
    url: '/about',
    text: 'About'
  },
  {
    url: '/contact',
    text: 'Contact'
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
    url: 'https://trello.com/b/ugfyF3BE/timezone-io',
    text: 'Roadmap',
    target: '_blank'
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
                   target={link.target}
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
