'use strict';
var React   = require('react');
var assign  = require('xtend/mutable')
  , Promise = require('es6-promise').Promise
  , uniq    = require('array-uniq')

var Form = React.createClass({displayName: "Form",

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

      listen: function(fn)  {
        this._handlers.push(fn)
        return function()  {return this._handlers.splice(this._handlers.indexOf(fn), 1);}.bind(this)
      }.bind(this),

      register: function(name, group, component)  {
        if( arguments.length === 2)
          component = group, group = null;

        this._inputs[name] = component

        if( !(!group || !group.length))
          [].concat(group).forEach( function(grp)  {
            if( !this._groups.hasOwnProperty(grp) )
              return (this._groups[grp] = [name])

            if( this._groups[grp].indexOf(name) === -1)
              this._groups[grp].push(name)
          }.bind(this))
      }.bind(this),

      onFieldValidate: function(field, event, args)  {
        var prevented = false;

        this.props.onValidate &&
          this.props.onValidate({ 
            event:event, field:field, args:args,
            input: this._inputs[field], 
            preventDefault:function(){ prevented = true } 
          })

        if( !prevented)
          this.validateField(field)
            .catch( function(e)  {return setTimeout( function(){ throw e });})
      }.bind(this),

      unregister: function(name, grp)  {
        var remove = function(name, grp)  {
              var idx = this._groups[grp].indexOf(name)
              if(idx !== -1 ) this._groups[grp].splice(idx, 1)
            }.bind(this);

        if(grp) return remove(name, grp)

        for(var key in this._groups) if (this._groups.hasOwnProperty(key))
          remove(name, key)

        delete this._inputs[name]
      }.bind(this)
    }

  },

  render:function() {
    // var { children, ...props } = this.props;
    attachChildren(this.props.children, this.getChildContext())

    return this.props.children; 
  },

  errors:function(names){
    if( (!names || !names.length) )
      return assign({}, this._errors)

    return [].concat(names).reduce( function(o, name)  {
      if( this._errors[name]) 
        o[name] = this._errors[name]

      return o
    }.bind(this), {})
  },

  isValid:function(name){
    return !this._errors[name] || !this._errors[name].length
  },

  _emit: function(){
    this._handlers.forEach(function(fn)  {return fn();})
  },

  validate:function(grp, args){
    var isGroup = !(!grp || !grp.length)
      , inputs  = isGroup ? this._inputsForGroups(grp) : Object.keys(this._inputs);

    isGroup 
      ? this._removeError(inputs) 
      : (this._errors = {})

    return Promise
      .all(inputs.map( 
          function(key)  {return this._validateField(key, args);}.bind(this))) 
      .then(function()  {return this._emit();}.bind(this))
  },

  validateField:function(name, args){
    var fields = [].concat(name).map( function(key)  {return this._validateField(key, args);}.bind(this))

    this._removeError(name)

    return Promise
      .all(fields) 
      .then(function()  {return this._emit();}.bind(this))
  },

  _validateField:function(name, args){
    var input = this._inputs[name]
    
    return new Promise( function(resolve, reject)  {
      try {
          Promise.resolve(this.props.validate(name, input, args))
            .then(function(msgs)  {
              msgs = msgs == null ? [] : [].concat(msgs)
              if(msgs.length) this._addError(name, msgs)
              resolve(!msgs.length)
            }.bind(this))
            .catch(reject)
      } 
      catch(err) {
        reject(err)
      }
    }.bind(this));
  },

  _addError:function(name, msgs){
    this._errors[name] = msgs
  },

  _removeError:function(fields){
    [].concat(fields)
      .forEach( function(field)  {return delete this._errors[field];}.bind(this))
  },

  _inputsForGroups:function(grps){
    return uniq([].concat(grps).reduce( 
      function(g, grp)  {return g.concat(this._groups[grp]);}.bind(this), []))
  }

});

module.exports = Form;



function attachChildren(children, context) {
  React.Children.forEach(children, function(child)  {
    if( !React.isValidElement(child) ) 
      return 

    if( child.type.contextTypes )
      assign(child._context, context)
    
    if ( child.props.children) 
      attachChildren(child.props.children, context)
  });
}

