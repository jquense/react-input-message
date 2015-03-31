'use strict';
var React = require('react')
  , connectToMessageContainer = require('./connectToMessageContainer');

class Message extends React.Component {

  static defaultProps = {
    component: 'span'
  }

  render() {
    var classes = 'rv-validation-message'
      , errors = this.props.messages;

    errors = Object.keys(errors)
        .reduce( (errs, grp) => errs.concat(errors[grp]), []);

    if (this.props.active)
      classes += ' field-error'

    return React.createElement(this.props.component, {
      className: classes,
    }, errors.join(', '));
  }

}

module.exports = connectToMessageContainer(Message)