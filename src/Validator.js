'use strict';
var React   = require('react')
  , ReactElement = require('react/lib/ReactElement')
  , Promise = require('promise/lib/es6-extensions');

class Validator {

  constructor(validate){

    this._validator = validate
    this._errors = Object.create(null)
    this.hasValidated = false;
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

  validate(name, context){
    var fields = [].concat(name).map( key => this._validateField(key, context))

    this._removeError(name)

    return Promise.all(fields)
      .then(fields => {
        this.hasValidated = true
        return fields
      })
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
    [].concat(fields).forEach(
      field => delete this._errors[field])
  }
}

module.exports = Validator
