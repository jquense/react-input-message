'use strict';
var React   = require('react')
  , ReactElement = require('react/lib/ReactElement');

var Promise = require('es6-promise').Promise
  , uniq    = require('array-uniq')


class Validator {

  constructor(validate){
    this._fields = {}
    this._groups = {}
    this._errors = {}

  }

  addField(name, group) {
    this._fields[name] = true

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

  errors(names){
    if( (!names || !names.length) )
      return { ...this._errors }

    return [].concat(names).reduce( (o, name) => {
      if( this._errors[name]) 
        o[name] = this._errors[name]

      return o
    }, {})
  }

  isValid(name){
    return !this._errors[name] || !this._errors[name].length
  }

  validate(grp, context){
    var isGroup = !(!grp || !grp.length)
      , inputs  = isGroup ? this._fieldsForGroups(grp) : Object.keys(this._fields);

    isGroup 
      ? this._removeError(inputs) 
      : (this._errors = {})

    return Promise
      .all(inputs.map( 
        key => this._validateField(key, context))) 
  }

  validateField(name, context){
    var fields = [].concat(name).map( key => this._validateField(key, context))

    this._removeError(name)

    return Promise.all(fields)
  }

  _validateField(name, context){
    return new Promise( (resolve, reject) => {
      Promise.resolve(this._validator(name, context))
        .then(msgs => {
          msgs = msgs == null ? [] : [].concat(msgs)
          if(msgs.length) this._addError(name, msgs)
          resolve(!msgs.length)
        })
        .catch(reject)
    });
  }

  _addError(name, msgs){
    this._errors[name] = msgs
  }

  _removeError(fields){
    [].concat(fields)
      .forEach( field => delete this._errors[field])
  }

  _fieldsForGroups(grps){
    return uniq([].concat(grps).reduce( 
      (g, grp) => g.concat(this._groups[grp]), []))
  }
}

module.exports = Validator