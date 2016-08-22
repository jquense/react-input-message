import React, { PropTypes } from 'react';
import Bridge from 'topeka/ChildBridge';
import connectToMessageContainer from './connectToMessageContainer';

let stringOrArrayOfStrings = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string)
]);

let { resolveNames } = connectToMessageContainer;

class MessageTrigger extends React.Component {

  static propTypes = {
    events: stringOrArrayOfStrings,

    for: stringOrArrayOfStrings,

    children: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.element
    ]),

    group: (props, name, compName, ...args) => {
      if (!props[name] && (!props.for || !props.for.length)) {
        return new Error(
          'A `group` prop is required when no `for` prop is provided' +
          `for component ${compName}`
        )
      }
      return stringOrArrayOfStrings(props, name, compName, ...args);
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
        events={this.props.events}
        onEvent={this.onEvent}
      >
        {this.inject}
      </Bridge>
    )
  }

  onEvent = (event, ...args) => {
    let { onValidate, children } = this.props
    let { messageContainer } = this.context;
    let handler = React.isValidElement(children) && children.props[event]

    handler &&
      handler.apply(this, args)

    if (!messageContainer) return

    onValidate = onValidate || messageContainer.onValidate

    onValidate(
        resolveNames(this.props, messageContainer)
      , event
      , args
    );
  }

  inject = (props) => {
    let { messages, children } = this.props;

    props.messages = messages

    if (typeof children === 'function')
      return children(props)

    return React.cloneElement(children, props)
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
