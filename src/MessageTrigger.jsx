import React, { PropTypes } from 'react';
import Bridge from 'topeka/ChildBridge';
import connectToMessageContainer from './connectToMessageContainer';

let stringOrArrayOfStrings = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string)
]);


class MessageTrigger extends React.Component{

  static propTypes = {
    events: stringOrArrayOfStrings,
    inject: React.PropTypes.func,

    for: stringOrArrayOfStrings,

    group: (props, name, compName) => {
      if (!props[name] && (!props.for || !props.for.length)) {
        return new Error(
          'A `group` prop is required when no `for` prop is provided' +
          `for component ${compName}`
        )
      }

      return stringOrArrayOfStrings(props, name, compName);
    }
  }

  static contextTypes = {
    messageContainer: React.PropTypes.object,
  }

  static defaultProps = {
    events: 'onChange',
  }

  constructor(...args) {
    super(...args)
    this.state = { isActive: false }
  }

  componentWillMount() {
    this.addToGroup();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.addToGroup(nextProps, nextContext);
  }

  componentWillUnmount() {
    this.removeFromGroup &&
      this.removeFromGroup()
  }

  render() {
    return (
      <Bridge
        inject={this.inject}
        events={this.props.events}
        onEvent={this.onEvent}
      >
        {this.props.children}
      </Bridge>
    )
  }

  onEvent = (event, handler, ...args) => {
    let { messageContainer } = this.context;

    handler && handler.apply(this, args)

    if (!messageContainer) return

    messageContainer.onValidate(
        this.resolveNames()
      , event
      , args
    );
  }

  inject = (child) => {
    let { messages, inject } = this.props;

    if (!inject) return false

    return inject(
      child,
      messages
    )
  }

  addToGroup(props = this.props, context = this.context){
    let { messageContainer } = context;
    let { 'for': forNames, group } = props;

    this.removeFromGroup &&
      this.removeFromGroup()

    if (!messageContainer || !forNames)
      return

    this.removeFromGroup =
      messageContainer.addToGroup(group, forNames)
  }

  resolveNames(props = this.props, context = this.context) {
    let { messageContainer } = context;
    let { 'for': forNames, group } = props;

    if (!forNames && messageContainer)
      forNames = messageContainer.namesForGroup(group);

    return forNames ? [].concat(forNames) : [];
  }
}

export default connectToMessageContainer(MessageTrigger)
