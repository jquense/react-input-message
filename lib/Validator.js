/** @preventMunge */ 
'use strict';
var Emitter = require('tiny-emitter');
var Promise = require('es6-promise').Promise
  , assign  = require('xtend')
  , uniq    = require('array-uniq')

for(var Emitter____Key in Emitter){if(Emitter.hasOwnProperty(Emitter____Key)){Validator[Emitter____Key]=Emitter[Emitter____Key];}}var ____SuperProtoOfEmitter=Emitter===null?null:Emitter.prototype;Validator.prototype=Object.create(____SuperProtoOfEmitter);Validator.prototype.constructor=Validator;Validator.__superConstructor__=Emitter;

  function Validator(fn){
    Emitter.call(this)
    this.onValidate = fn
    
    this._inputs = {}
    this._groups = {}
    this._errors = {}
  }

  Validator.prototype.register=function(name, group, component) {
    if( arguments.length === 2)
      component = group, group = null;

    this._inputs[name] = component

    if( !(!group || !group.length))
      [].concat(group)
        .forEach(this.addToGroup.bind(this, name))
  };

  Validator.prototype.unregister=function(name){
    this.removeFromGroups(name)
    delete this._inputs[name]
  };

  Validator.prototype.addToGroup=function(name, grp){

    if( !this._groups.hasOwnProperty(grp) )
      return (this._groups[grp] = [name])

    if( this._groups[grp].indexOf(name) === -1)
      this._groups[grp].push(name)
  };

  Validator.prototype.removeFromGroups=function(name, grp){
    var remove = function(name, grp)  {
          var idx = this._groups[grp].indexOf(name)
          if(idx !== -1 ) this._groups[grp].splice(idx, 1)
        }.bind(this);

    if(grp) return remove(name, grp)

    for(var key in this._groups) if (this._groups.hasOwnProperty(key))
      remove(name, key)
  };

  Validator.prototype.errors=function(names){
    if( (!names || !names.length) )
      return assign(this._errors)

    return [].concat(names).reduce( function(o, name)  {
      if( this._errors[name]) 
        o[name] = this._errors[name]

      return o
    }.bind(this), {})
  };

  Validator.prototype.isValid=function(name){
    return !this._errors[name] || !this._errors[name].length
  };

  Validator.prototype.validate=function(grp, args){
    var isGroup = !(!grp || !grp.length)
      , inputs  = isGroup ? this._inputsForGroups(grp) : Object.keys(this._inputs);

    isGroup 
      ? this._removeError(inputs) 
      : (this._errors = {})

    return Promise
      .all(inputs.map( 
          function(key)  {return this._validateField(key, args);}.bind(this))) 
      .then(function()  {return this.emit('change');}.bind(this))
  };

  Validator.prototype.validateField=function(name, args){
    var fields = [].concat(name).map( function(key)  {return this._validateField(key, args);}.bind(this))

    this._removeError(name)

    return Promise
      .all(fields) 
      .then(function()  {return this.emit('change');}.bind(this))
  };

  Validator.prototype._validateField=function(name, args){
    var input = this._inputs[name]
    
    return new Promise( function(resolve, reject)  {
      try {
          Promise.resolve(this.onValidate(name, input, args))
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
  };

  Validator.prototype._addError=function(name, msgs){
    this._errors[name] = msgs
  };

  Validator.prototype._removeError=function(fields){
    [].concat(fields)
      .forEach( function(field)  {return delete this._errors[field];}.bind(this))
  };

  Validator.prototype._inputsForGroups=function(grps){
    return uniq([].concat(grps).reduce( 
      function(g, grp)  {return g.concat(this._groups[grp]);}.bind(this), []))
  };



module.exports = Validator;