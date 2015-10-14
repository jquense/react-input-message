'use strict';
var React = require('react')
  , Bridge = require('topeka/ChildBridge')
  , connectToMessageContainer = require('./connectToMessageContainer');

var stringOrArrayOfStrings = React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.string)
    ])


class MessageTrigger extends React.Component{

  static propTypes = {
    events: stringOrArrayOfStrings,
    inject: React.PropTypes.func,

    for:   stringOrArrayOfStrings,
    group: stringOrArrayOfStrings
  }

  static contextTypes = {
    messageContainer: React.PropTypes.object,
  }

  static defaultProps = {
    events: 'onChange',
  }

  constructor(){
    super()
    this._inject = this._inject.bind(this);
    this._notify = this._notify.bind(this);
  }

  componentWillMount(){
    if (!this.props.for || !this.props.for.length)
      return

    this._removeFromGroup = this.context.messageContainer.addToGroup(
        this.props.group
      , this.props.for
    )
  }

  componentWillReceiveProps(nextProps) {
    this._removeFromGroup &&
      this._removeFromGroup()

    if (!nextProps.for || !nextProps.for.length)
      return

    this._removeFromGroup = this.context.messageContainer.addToGroup(
        nextProps.group
      , nextProps.for
    )
  }

  componentWillUnmount() {
    this._removeFromGroup &&
      this._removeFromGroup()
  }

  render() {
    return (
      <Bridge
        inject={this._inject}
        events={this.props.events}
        onEvent={this._notify}
      >
        {this.props.children}
      </Bridge>
    )
  }

  _inject(child) {
    var active = this.props.for && this.props.active;

    if (this.props.inject)
      return this.props.inject(child, !!active)
  }

  _notify(event, handler, ...args){
    var container = this.context.messageContainer
      , forProps = this.props.for ? [].concat(this.props.for) : [];

    handler
      && handler.apply(this, args)

    if (forProps.length)
      container.onValidateFields(forProps, event, args)
    else
      container.onValidateGroup(this.props.group, event, args)
  }
}

module.exports = connectToMessageContainer(MessageTrigger)
