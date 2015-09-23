'use strict';
var React = require('react');


class Avatar extends React.Component {

  constructor(props) {
    super(props);
  }

  handleLoadError(e) {
    if (typeof this.props.onImageLoadError === 'function')
      this.props.onImageLoadError(e);
  }

  render() {
    var classes = 'avatar';
    if (this.props.size) classes += ' ' + this.props.size;

    return (
      <img src={this.props.avatar}
           className={classes}
           onError={this.handleLoadError.bind(this)} />
     );
  }

}

module.exports = Avatar;
