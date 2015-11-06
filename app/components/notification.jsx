'use strict';

var React = require('react');

class Notification extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      active: true
    };
  }

  handleClickDismiss() {
    this.setState({ active: false });
  }


  getStyle(props) {
    if (props.style)
      return props.style;
    if (props.errors && props.errors.length)
      return 'error';
    if (props.message && props.message.length)
      return 'success';
    return '';
  }

  getText(props) {
    if (props.text)
      return props.text;
    if (props.errors && props.errors.length)
      return props.errors;
    if (props.message && props.message.length)
      return props.message;
    return '';
  }

  renderArray(arr) {
    return arr.map(function(item, idx) {
      return <span key={idx}>{item}</span>
    });
  }

  render() {
    var style = this.getStyle(this.props);
    var text = this.getText(this.props);

    var className = 'notification';

    if (style)
      className += ' notification-' + style;

    if (this.props.allowDismiss)
      className += ' notification-dismissable';

    var displayText = Array.isArray(text) ? this.renderArray(text) : text;

    if (!displayText || !displayText.length || !this.state.active)
      return <span style={{display: 'none'}}></span>;

    return (
      <div className={className}>
        {displayText}
        { this.props.allowDismiss &&
          <span className="notification-dismiss material-icons md-18"
                  name="Dismiss notification"
                  onClick={this.handleClickDismiss.bind(this)}>
            clear
          </span>
        }
      </div>
    );
  }
};

module.exports = Notification;
