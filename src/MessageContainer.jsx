'use strict';
var React   = require('react')
  , ReactElement = require('react/lib/ReactElement');

var Promise = require('es6-promise').Promise
  , uniq = array => array.filter((item, idx) => array.indexOf(item) == idx)

let has = (obj, key) => obj && {}.hasOwnProperty.call(obj, key)

module.exports = class ValidationContainer extends React.Component {

  static defaultProps = {
    messages: Object.create(null)
  }

  static propTypes = {
    messages:           React.PropTypes.object,
    onValidationNeeded: React.PropTypes.func.isRequired
  }

  static childContextTypes = {

    onValidateField: React.PropTypes.func,
    onValidateGroup: React.PropTypes.func,

    messages:        React.PropTypes.func,

    register:        React.PropTypes.func,
    unregister:      React.PropTypes.func,

    listen:          React.PropTypes.func
  }

  constructor(props, context) {
    super(props, context)

    this._handlers = []
    
    this._groups = Object.create(null)
    this._fields = Object.create(null)

    this.state = {
      children: getChildren(props, this.getChildContext())
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({ 
      children: getChildren(nextProps, this.getChildContext())
    })
  }

  componentDidMount(){
    this._emit()
  }

  componentDidUpdate(){
    this._emit()
  }

  getChildContext() {

    // cache the value to avoid the damn owner/parent context warnings. TODO: remove in 0.14
    return this._context || (this._context = {

      messages: this._messages.bind(this),

      listen: (fn) => {
        this._handlers.push(fn)
        return () => this._handlers.splice(this._handlers.indexOf(fn), 1)
      },

      register: (name, group, target) => {
        this.addField(name, group, target)
        return this.removeField.bind(this, name, group)
      },
      
      onValidateField: (field, event, target, args) => {
        this.props.onValidationNeeded &&
          this.props.onValidationNeeded({ event, field, args, target })
      },

      onValidateGroup: (group, event, target, args) => {
        var inputs = this.fields(group);

        inputs.forEach( field => {
          this.props.onValidationNeeded &&
            this.props.onValidationNeeded({ event, field, args, target: this._fields[field] })
        })
      }
    })
  }

  addField(name, group, target) {
    if ( !name ) return 

    this._fields[name] = target

    if( !(!group || !group.length))
      [].concat(group).forEach( grp => {
        if( !has(this._groups, grp) )
          return (this._groups[grp] = [name])

        if( this._groups[grp].indexOf(name) === -1)
          this._groups[grp].push(name)
      })
  }

  removeField(name, group) {
    var remove = (name, group) => {
          var idx = this._groups[group].indexOf(name)

          if(idx !== -1 ) this._groups[group].splice(idx, 1)
        };

    if ( !name ) 
      return 

    if( group ) 
      return remove(name, group)

    for(var key in this._groups) if (has(this._groups, key))
      remove(name, key)

    this._fields[name] = false
  }

  render() {
    return this.state.children
  }

  fields(groups){
    var isGroup = !(!groups || !groups.length)

    groups = [].concat(groups)

    return isGroup 
      ? uniq(groups.reduce((fields, group) => fields.concat(this._groups[group]), []))
      : Object.keys(this._fields);
  }

  _emit(){
    this._handlers.forEach(fn => fn())
  }

  _messages(names, groups){
    if( (!names || !names.length) ){
      if ( !groups || !groups.length)
        return { ...this.props.messages }

      names = this.fields(groups)
    }

    return [].concat(names).reduce( (o, name) => {
      if( this.props.messages[name]) 
        o[name] = this.props.messages[name]

      return o
    }, {})
  }

}

function getChildren(props, context) {
  
  if ( process.env.NODE_ENV !== 'production' ){
    // this is to avoid the warning but its hacky so lets do it a less hacky way in production
    return attachChildren(React.Children.only(props.children), context)
  }
  else
    return props.children
}

function attachChildren(children, context) {

  if ( typeof children === 'string' || React.isValidElement(children))
    return clone(children)

  return React.Children.map(children, clone)

  function clone (child) {
    var props = child.props

    if ( !React.isValidElement(child))
      return child;

    if ( props.children )
      props = { ...child.props, children: attachChildren(props.children, context) }

    return new ReactElement(
      child.type,
      child.key,
      child.ref,
      child._owner,
      { ...child._context, ...context},
      props
    )
  }
}

