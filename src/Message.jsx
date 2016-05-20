import React, { PropTypes } from 'react';
import connectToMessageContainer from './connectToMessageContainer';

let values = obj => Object.keys(obj).map( k => obj[k] )
let flatten = (arr, next) => arr.concat(next)

function messagesForNames(names, messages) {
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
    children: messages => messages.join(', ')
  }

  static contextTypes = {
    messageContainer: React.PropTypes.object,
  }

  componentWillMount() {
    this.setState(
      this.getMessageState(
        this.props,
        this.context
      ))
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState(
      this.getMessageState(
        nextProps,
        nextContext
      ))
  }

  getMessageState(props, context) {
    let { messagesForNames, messages, ...args } = props;
    let names = this.resolveNames(props, context);

    messages = names == null ? messages : messagesForNames(
        names
      , messages
      , args
    )

    return { messages }
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
        {children(
          values(activeMessages)
            .reduce(flatten, [])
        )}
      </Component>
    )
  }

  resolveNames(props, context) {
    let { messageContainer } = context;
    let { 'for': forNames, group } = props;

    if (!forNames) {
      if (!group || !messageContainer)
        return null

      forNames = messageContainer.namesForGroup(group);
    }
    return forNames ? [].concat(forNames) : [];
  }
}

module.exports = connectToMessageContainer(Message)
module.exports._Message = Message
