'use strict';
var React   = require('react')
  , ReactElement = require('react/lib/ReactElement');

var Promise = require('es6-promise').Promise
  , uniq    = require('array-uniq')


module.exports = React.createClass({

  displayName: 'ValidationContainer',

  propTypes: {
    onValidate: React.PropTypes.func.isRequired
  },

  childContextTypes: {

    onValidateField: React.PropTypes.func,
    onValidateGroup: React.PropTypes.func,
    errors:          React.PropTypes.func,
    register:        React.PropTypes.func,
    unregister:      React.PropTypes.func,
    listen:          React.PropTypes.func
  },

  componentWillMount() {
    this._handlers = []
  },

  getInitialState() {
    return {
      errors: {},
      children: attachChildren(
          React.Children.only(this.props.children)
        , this.getChildContext())
    };
  },

  componentWillReceiveProps(nextProps){
    this.setState({ 
      children: attachChildren(
          React.Children.only(nextProps.children)
        , this.getChildContext())
    })
  },

  getChildContext() {

    // cache the value to avoid the damn owner/parent context warnings. TODO: remove in 0.14
    return this._context || (this._context = {

      errors: this._errors,

      listen: fn => {
        this._handlers.push(fn)
        return () => this._handlers.splice(this._handlers.indexOf(fn), 1)
      },

      register: (name, group) => 
        this.props.validator.addField(name, group),
      
      unregister: (name, group) =>  
        this.props.validator.removeField(name, group),

      onValidateField: (field, event, target, args) => {
        this.props.onValidate &&
          this.props.onValidate({ event, field, args, target })
      },

      onValidateGroup: (group, event, target, args) => {
        this.props.onValidate &&
          this.props.onValidate({ event, group, args, target })
      }
    })
  },

  render() {
    return this.props.children
  },

  _emit(){
    this._handlers.forEach(fn => fn())
  },

  _errors(names){
    if( (!names || !names.length) )
      return { ...this._errors }

    return [].concat(names).reduce( (o, name) => {
      if( this._errors[name]) 
        o[name] = this._errors[name]

      return o
    }, {})
  }

});

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