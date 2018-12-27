const React = require('react')

const links = [
  {
    url: '/about',
    text: 'About'
  },
  {
    url: '/contact',
    text: 'Contact'
  },
  {
    url: '/terms',
    text: 'Terms'
  },
  {
    url: '/privacy',
    text: 'Privacy Policy'
  },
  {
    url: '/team/buffer',
    text: 'Demo'
  },
  {
    url: '/login',
    text: 'Login'
  },
];

class Footer extends React.Component {
  render() {

    var year = new Date().getFullYear();

    return (
      <footer className="hp-section site-footer">

        <div className="hp-content-container">

          <p>
            © {year} Timezone.io <br/>
          </p>
          <p>
            {links.map(function(link, idx) {
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
}

module.exports = Footer
