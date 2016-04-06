var React = require('react')
  , connectToMessageContainer = require('./connectToMessageContainer');

let values = obj => Object.keys(obj).map( k => obj[k] )
let flatten = (arr, next) => arr.concat(next)

class Message extends React.Component {

  static defaultProps = {
    component: 'span',
    delim: ', ',
    extract: f => f,
    filter: f => true
  }

  render() {
    var {
        component: Component
      , messages
      , active
      , delim
      , extract
      , filter
      , for: fieldFor
      , ...props } = this.props;


    if (!active)
      return null

    return (
      <Component {...props}>
      {
        values(messages)
          .reduce(flatten, [])
          .filter((v, i, l) => filter(v, i, l, extract))
          .map(extract)
          .join(delim)
      }
      </Component>
    )
  }
}

module.exports = connectToMessageContainer(Message)
module.exports._Message = Message
