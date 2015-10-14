'use strict';
var React   = require('react');
var uniq = array => array.filter((item, idx) => array.indexOf(item) == idx)

let has = (obj, key) => obj && {}.hasOwnProperty.call(obj, key)

module.exports = class ValidationContainer extends React.Component {

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

    this._messages = this._messages.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this._emit(nextProps)
  }

  getChildContext() {

    return this._context || (this._context = {

      messageContainer: {

        subscribe: listener => {
          this._handlers.push(listener)
          listener(this._listenerContext(this.props))
          return () => this._handlers.splice(this._handlers.indexOf(listener), 1)
        },

        addToGroup: (group = '', fields) => {
          group = this._groups[group] || (this._groups[group] = [])
          fields = [].concat(fields)

          fields.forEach(f => {
            if (group.indexOf(f) === -1)
              group.push(f)
          })

          return () => fields.forEach(
            f => group.splice(group.indexOf(f), 1)
          )
        },

        onValidateFields: (fields, type, args) => {
          this.props.onValidationNeeded &&
            this.props.onValidationNeeded({ type, fields, args })
        },

        onValidateGroup: (group, type, args) => {
          var fields = this.fieldsForGroup(group);
          this.props.onValidationNeeded &&
            this.props.onValidationNeeded({ type, fields, args })
        }
      }
    })
  }

  _listenerContext(props){
    return this._messages.bind(null, props.messages || {})
  }

  render() {
    return this.props.children
  }

  fieldsForGroup(groups = Object.keys(this._groups)){
    groups = [].concat(groups)
    return uniq(groups.reduce(
      (fields, group) => fields.concat(this._groups[group]), [])
    )
  }

  _emit(props) {
    let context = this._listenerContext(props);
    this._handlers.forEach(fn => fn(context))
  }

  _messages(messages, names, groups){
    if (!names || !names.length) {
      if (!groups || !groups.length)
        return { ...messages }

      names = this.fieldsForGroup(groups)
    }

    return [].concat(names).reduce( (o, name) => {
      if (messages[name])
        o[name] = messages[name]

      return o
    }, {})
  }

}
