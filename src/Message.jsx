'use strict';
var React = require('react')
  , cn = require('classnames')
  , connectToMessageContainer = require('./connectToMessageContainer');

let values = obj => Object.keys(obj).map( k => obj[k] )

class Message {

  static defaultProps = {
    component: 'span',
    delim: ', '
  }

  constructor(props){
    this.props = props
  }

  render() {
    var { 
        component: Component
      , messages
      , active
      , delim
      , ...props } = this.props;

    if (!active)
      return null

    return (
      <Component {...props}>
      { values(messages).join(delim) }
      </Component>
    )
  }
}

module.exports = connectToMessageContainer(Message)
module.exports._Message = Message