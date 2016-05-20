import React, { PropTypes } from 'react';
import connectToMessageContainer from './connectToMessageContainer';

let values = obj => Object.keys(obj).map( k => obj[k] )
let flatten = (arr, next) => arr.concat(next)

function messagesForNames(names, messages) {
  if (!names.length) return messages;

  let messagesForNames = {};

  names.forEach(name => {
    if (messages[name])
      messagesForNames[name] = messages[name]
  })

  return messagesForNames;
}


let stringOrArrayOfStrings = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string)
]);

class Message extends React.Component {
  static propTypes = {
    for: stringOrArrayOfStrings,
    group: stringOrArrayOfStrings,
    messagesForNames: PropTypes.func,
    children: PropTypes.func,
    component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
  }

  static defaultProps = {
    messagesForNames,
    component: 'span',
    children: (messages) => (
      values(messages)
        .reduce(flatten, [])
        .join(', ')
    )
  }

  static contextTypes = {
    messageContainer: React.PropTypes.object,
  }

  componentWillMount() {
    let { messagesForNames, messages, ...props } = this.props;
    this.setState({
      messages: messagesForNames(
          this.resolveNames()
        , messages
        , ...props
      )
    })
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let { messagesForNames, messages, ...props } = nextProps;
    this.setState({
      messages: messagesForNames(
          this.resolveNames(nextProps, nextContext)
        , messages
        , ...props
      )
    })
  }

  render() {
    let {
      /* eslint-disable no-unused-vars */
        messages, for: fieldFor
      /* eslint-enable no-unused-vars */

      , component: Component
      , children
      , ...props } = this.props;

    let activeMessages = this.state.messages;

    if (!Object.keys(activeMessages || {}).length)
      return null

    return (
      <Component {...props}>
        {children(activeMessages)}
      </Component>
    )
  }

  resolveNames(props = this.props, context = this.context) {
    let { messageContainer } = context;
    let { 'for': forNames, group } = props;

    if (!forNames && group && messageContainer)
      forNames = messageContainer.namesForGroup(group);

    return forNames ? [].concat(forNames) : [];
  }
}

module.exports = connectToMessageContainer(Message)
module.exports._Message = Message
