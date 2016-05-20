import React from 'react';

let uniq = array => array.filter((item, idx) => array.indexOf(item) === idx);

let add = (array, item) => array.indexOf(item) === -1 && array.push(item)

let remove = (array, item) => array.filter(i => i !== item)

export default class MessageContainer extends React.Component {

  static defaultProps = {
    messages: Object.create(null)
  }

  static propTypes = {
    messages:           React.PropTypes.object,
    onValidationNeeded: React.PropTypes.func
  }

  static childContextTypes = {
    messageContainer: React.PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)
    this._handlers = []
    this._groups = Object.create(null)
  }

  componentWillReceiveProps(nextProps) {
    this._emit(nextProps)
  }

  getChildContext() {
    if (!this._context)
      this._context = {
        messageContainer: {
          addToGroup: this.addToGroup,
          namesForGroup: this.namesForGroup,
          subscribe: this.subscribe,
          onValidate: this.onValidate
        }
      }

    return this._context
  }

  namesForGroup = groups => {
    groups = Object.keys(this._groups)
    groups = [].concat(groups)

    return uniq(groups.reduce(
      (fields, group) => fields.concat(this._groups[group]), [])
    )
  };

  addToGroup = (grpName, names) => {
    let group = this._groups[grpName]

    names = names && [].concat(names)

    if (!names || !names.length)
      return

    if (!group)
      group = this._groups[grpName] = []

    names.forEach(name => add(group, name))

    return () => names.forEach(name => remove(group, name))
  };

  onValidate = (fields, type, args) => {
    if (!fields || !fields.length) return

    this.props.onValidationNeeded &&
      this.props.onValidationNeeded({ type, fields, args })
  };

  subscribe = listener => {
    let context = this._listenerContext(this.props);

    this._handlers.push(listener)

    listener(context);

    return () => remove(this._handlers, listener)
  };

  _emit(props) {
    let context = this._listenerContext(props);
    this._handlers.forEach(fn => fn(context))
  }

  _listenerContext({ messages }) {
    return messages
  }

  render() {
    return this.props.children
  }
}
