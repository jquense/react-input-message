/** @preventMunge */ 
'use strict';
var Emitter = require('tiny-emitter');
var Promise = require('es6-promise').Promise
  , assign  = require('xtend')
  , uniq    = require('array-uniq')

class Validator extends Emitter {

  constructor(fn){
    super()
    this.setValidator(fn)
    
    this._inputs   = {}
    this._groups   = {}
    this._errors   = {}
  }

  setValidator(fn){
    this._validate = fn
  }

  register(name, group, component) {
    if( arguments.length === 2)
      component = group, group = null;

    this._inputs[name] = component

    if( !(!group || !group.length))
      [].concat(group)
        .forEach(this.addToGroup.bind(this, name))
  }

  unregister(name){
    this.removeFromGroups(name)
    delete this._inputs[name]
  }

  addToGroup(name, grp){

    if( !this._groups.hasOwnProperty(grp) )
      return (this._groups[grp] = [name])

    if( this._groups[grp].indexOf(name) === -1)
      this._groups[grp].push(name)
  }

  removeFromGroups(name, grp){
    var remove = (name, grp) => {
          var idx = this._groups[grp].indexOf(name)
          if(idx !== -1 ) this._groups[grp].splice(idx, 1)
        };

    if(grp) return remove(name, grp)

    for(var key in this._groups) if (this._groups.hasOwnProperty(key))
      remove(name, key)
  }

  errors(names){
    if( (!names || !names.length) )
      return assign(this._errors)

    return [].concat(names).reduce( (o, name) => {
      if( this._errors[name]) 
        o[name] = this._errors[name]

      return o
    }, {})
  }

  isValid(name){
    return !this._errors[name] || !this._errors[name].length
  }

  validate(grp){
    var isGroup = !(!grp || !grp.length)
      , inputs  = isGroup ? this._inputsForGroups(grp) : Object.keys(this._inputs);

    isGroup 
      ? this._removeError(inputs) 
      : (this._errors = {})

    return Promise
      .all(inputs.map( 
          key => this._validateField(key))) 
      .then(() => this.emit('change'))
  }

  validateField(name){
    var fields = [].concat(name).map( key => this._validateField(key))

    this._removeError(name)

    return Promise
      .all(fields) 
      .then(() => this.emit('change'))
  }

  _validateField(name){
    var input = this._inputs[name]
    
    return new Promise( (resolve, reject) => {
      try {
          Promise.resolve(this._validate(name, input))
            .then(msgs => {
              msgs = msgs == null ? [] : [].concat(msgs)
              if(msgs.length) this._addError(name, msgs)
              resolve(!msgs.length)
            })
            .catch(reject)
      } 
      catch(err) {
        reject(err)
      }
    });
  }

  _addError(name, msgs){
    this._errors[name] = msgs
  }

  _removeError(fields){
    [].concat(fields)
      .forEach( field => delete this._errors[field])
  }

  _inputsForGroups(grps){
    return uniq([].concat(grps).reduce( 
      (g, grp) => g.concat(this._groups[grp]), []))
  }
}


module.exports = Validator;