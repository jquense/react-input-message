'use strict';
var React   = require('react');
var assign  = require('xtend/mutable')
  , Promise = require('es6-promise').Promise
  , uniq    = require('array-uniq')

var Form = React.createClass({

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

  componentWillMount: function() {
    this._inputs   = {}
    this._groups   = {}
    this._errors   = {}
    this._handlers = []
  },

  getInitialState: function() {
    return {
      errors: {}
    };
  },

  getChildContext: function() {

    return { 
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
            .catch( e => setTimeout( ()=>{ throw e }))
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
    }

  },

  render() {
    // var { children, ...props } = this.props;
    attachChildren(this.props.children, this.getChildContext())

    return this.props.children; 
  },

  errors(names){
    if( (!names || !names.length) )
      return assign({}, this._errors)

    return [].concat(names).reduce( (o, name) => {
      if( this._errors[name]) 
        o[name] = this._errors[name]

      return o
    }, {})
  },

  isValid(name){
    return !this._errors[name] || !this._errors[name].length
  },

  _emit: function(){
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

module.exports = Form;



function attachChildren(children, context) {
  React.Children.forEach(children, child => {
    if( !React.isValidElement(child) ) 
      return 

    if( child.type.contextTypes )
      assign(child._context, context)
    
    if ( child.props.children) 
      attachChildren(child.props.children, context)
  });
}

