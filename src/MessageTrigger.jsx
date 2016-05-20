import React, { PropTypes } from 'react';
import Bridge from 'topeka/ChildBridge';
import connectToMessageContainer from './connectToMessageContainer';

let stringOrArrayOfStrings = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string)
]);

function isActive(names, messages) {
  return names.some(name => !!messages[name])
}

class MessageTrigger extends React.Component{

  static propTypes = {
    events: stringOrArrayOfStrings,
    inject: React.PropTypes.func,
    isActive: React.PropTypes.func.isRequired,

    for:   stringOrArrayOfStrings,
    group: stringOrArrayOfStrings
  }

  static contextTypes = {
    messageContainer: React.PropTypes.object,
  }

  static defaultProps = {
    isActive,
    events: 'onChange',
  }

  constructor(...args) {
    super(...args)
    this.state = { isActive: false }
  }

  componentWillMount() {
    let { isActive, messages, ...props } = this.props;

    this.addToGroup();
    this.setState({
      isActive: isActive(
          this.resolveNames()
        , messages
        , ...props
      )
    })
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let { isActive, messages, ...props } = nextProps;

    this.addToGroup(nextProps, nextContext);
    this.setState({
      isActive: isActive(
          this.resolveNames(nextProps, nextContext)
        , messages
        , props
      )
    })
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
    let { messages, inject, isActive } = this.props;

    if (!inject) return false
    let names = this.resolveNames();

    return inject(child, isActive(names, messages))
  }

  addToGroup(props = this.props, context = this.context){
    let { messageContainer } = context;
    let { 'for': forNames, group } = props;

    this.removeFromGroup &&
      this.removeFromGroup()

    if (!messageContainer || !group || !forNames)
      return

    this.removeFromGroup =
      messageContainer.addToGroup(group, forNames)
  }

  resolveNames(props = this.props, context = this.context) {
    let { messageContainer } = context;
    let { 'for': forNames, group } = props;

    if (!forNames && group && messageContainer)
      forNames = messageContainer.namesForGroup(group);

    return forNames ? [].concat(forNames) : [];
  }
}

export default connectToMessageContainer(MessageTrigger)
