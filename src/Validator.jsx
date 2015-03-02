'use strict';
var React   = require('react')
  , ReactElement = require('react/lib/ReactElement');

var Promise = require('es6-promise').Promise
  , uniq    = require('array-uniq')

module.exports = React.createClass({

  displayName: 'Validator',

  propTypes: {
    onValidate: React.PropTypes.func,
    validate:   React.PropTypes.func.isRequired
  },

  childContextTypes: {
    validate:        React.PropTypes.func,
    validateField:   React.PropTypes.func,
    onFieldValidate: React.PropTypes.func,
    errors:          React.PropTypes.func,
    register:        React.PropTypes.func,
    unregister:      React.PropTypes.func,
    listen:          React.PropTypes.func
  },

  componentWillMount() {
    this._inputs   = {}
    this._groups   = {}
    this._errors   = {}
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
      errors:        this.errors,
      validate:      this.validate,
      validateField: this.validateField,

      listen: fn => {
        this._handlers.push(fn)
        return () => this._handlers.splice(this._handlers.indexOf(fn), 1)
      },

      register: (name, group, component) => {
        if( arguments.length === 2)
          component = group, group = null;

        this._inputs[name] = component

        if( !(!group || !group.length))
          [].concat(group).forEach( grp => {
            if( !this._groups.hasOwnProperty(grp) )
              return (this._groups[grp] = [name])

            if( this._groups[grp].indexOf(name) === -1)
              this._groups[grp].push(name)
          })
      },

      onFieldValidate: (field, event, args) => {
        var prevented = false;

        this.props.onValidate &&
          this.props.onValidate({ 
            event, field, args,
            input: this._inputs[field], 
            preventDefault(){ prevented = true } 
          })

        if( !prevented)
          this.validateField(field)
            .catch( e => setTimeout(()=>{ throw e }))
      },

      unregister: (name, grp) => {
        var remove = (name, grp) => {
              var idx = this._groups[grp].indexOf(name)
              if(idx !== -1 ) this._groups[grp].splice(idx, 1)
            };

        if(grp) return remove(name, grp)

        for(var key in this._groups) if (this._groups.hasOwnProperty(key))
          remove(name, key)

        delete this._inputs[name]
      }
    })
  },

  render() {
    return this.state.children
  },

  errors(names){
    if( (!names || !names.length) )
      return { ...this._errors }

    return [].concat(names).reduce( (o, name) => {
      if( this._errors[name]) 
        o[name] = this._errors[name]

      return o
    }, {})
  },

  isValid(name){
    return !this._errors[name] || !this._errors[name].length
  },

  _emit(){
    this._handlers.forEach(fn => fn())
  },

  validate(grp, args){
    var isGroup = !(!grp || !grp.length)
      , inputs  = isGroup ? this._inputsForGroups(grp) : Object.keys(this._inputs);

    isGroup 
      ? this._removeError(inputs) 
      : (this._errors = {})

    return Promise
      .all(inputs.map( 
          key => this._validateField(key, args))) 
      .then(() => this._emit())
  },

  validateField(name, args){
    var fields = [].concat(name).map( key => this._validateField(key, args))

    this._removeError(name)

    return Promise
      .all(fields) 
      .then(() => this._emit())
  },

  _validateField(name, args){
    var input = this._inputs[name]
    
    return new Promise( (resolve, reject) => {
      Promise.resolve(this.props.validate(name, input, args))
        .then(msgs => {
          msgs = msgs == null ? [] : [].concat(msgs)
          if(msgs.length) this._addError(name, msgs)
          resolve(!msgs.length)
        })
        .catch(reject)
    });
  },

  _addError(name, msgs){
    this._errors[name] = msgs
  },

  _removeError(fields){
    [].concat(fields)
      .forEach( field => delete this._errors[field])
  },

  _inputsForGroups(grps){
    return uniq([].concat(grps).reduce( 
      (g, grp) => g.concat(this._groups[grp]), []))
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