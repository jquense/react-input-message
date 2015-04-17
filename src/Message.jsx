'use strict';
var React = require('react')
  , cn = require('classnames')
  , connectToMessageContainer = require('./connectToMessageContainer');

let values = obj => Object.keys(obj).map( k => obj[k] )
let flatten = (arr, next) => arr.concat(next)

class Message extends React.Component {

  static defaultProps = {
    component: 'span',
    delim: ', '
  }

  render() {
    var { 
        component: Component
      , messages
      , active
      , delim
      , for: fieldFor
      , ...props } = this.props;


    if (!active)
      return null

    return (
      <Component {...props}>
      { values(messages).reduce(flatten, []).join(delim) }
      </Component>
    )
  }
}

module.exports = connectToMessageContainer(Message)
module.exports._Message = Message