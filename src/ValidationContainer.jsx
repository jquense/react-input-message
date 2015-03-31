'use strict';
var React   = require('react')
  , ReactElement = require('react/lib/ReactElement');

var Promise = require('es6-promise').Promise
  , uniq    = require('array-uniq')


module.exports = class ValidationContainer extends React.Component {

  static defaultProps = {
    errors: []
  }

  static propTypes = {
    errors:     React.PropTypes.array,
    onValidate: React.PropTypes.func.isRequired
  }

  static childContextTypes = {

    onValidateField: React.PropTypes.func,
    onValidateGroup: React.PropTypes.func,
    errors:          React.PropTypes.func,
    register:        React.PropTypes.func,
    unregister:      React.PropTypes.func,
    listen:          React.PropTypes.func
  }

  constructor(props, context) {
    super(props, context)

    this._handlers = []
    
    this._groups = Map ? new Map() : Object.create(null)
    this._fields = Map ? new Map() : Object.create(null)

    this.state = {
      children: attachChildren(
          React.Children.only(props.children)
        , this.getChildContext())
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({ 
      children: attachChildren(
          React.Children.only(nextProps.children)
        , this.getChildContext())
    })
  }

  componentDidUpdate(){
    this._emit()
  }

  getChildContext() {

    // cache the value to avoid the damn owner/parent context warnings. TODO: remove in 0.14
    return this._context || (this._context = {

      errors: this._errors.bind(this),

      listen: fn => {
        this._handlers.push(fn)
        return () => this._handlers.splice(this._handlers.indexOf(fn), 1)
      },

      register: (name, group, target) => 
        this.addField(name, group, target),
      
      unregister: (name, group) =>  
        this.removeField(name, group),

      onValidateField: (field, event, target, args) => {
        this.props.onValidate &&
          this.props.onValidate({ event, field, args, target })
      },

      onValidateGroup: (group, event, target, args) => {
        var isGroup = !(!group || !group.length)
          , inputs  = isGroup ? this._fieldsForGroups(group) : Object.keys(this._fields);

        inputs.forEach( field => {
          this.props.onValidate &&
            this.props.onValidate({ event, field, args, target: this._fields[field] })
        })
      }
    })
  }

  addField(name, group, target) {
    this._fields[name] = target

    if( !(!group || !group.length))
      [].concat(group).forEach( grp => {
        if( !this._groups.hasOwnProperty(grp) )
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

    if( group ) 
      return remove(name, group)

    for(var key in this._groups) if (this._groups.hasOwnProperty(key))
      remove(name, key)

    this._fields[name] = false
  }

  render() {
    return this.props.children
  }

  _emit(){
    this._handlers.forEach(fn => fn())
  }

  _fieldsForGroups(grps){
    return uniq([].concat(grps).reduce( 
      (g, grp) => g.concat(this._groups[grp]), []))
  }

  _errors(names){
    if( (!names || !names.length) )
      return { ...this.props.errors }

    return [].concat(names).reduce( (o, name) => {
      if( this.props.errors[name]) 
        o[name] = this.props.errors[name]

      return o
    }, {})
  }

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