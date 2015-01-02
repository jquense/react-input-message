'use strict';
var React = require('react')
var Validator = require('../Validator');

module.exports = {

  contextTypes: {
    validator: React.PropTypes.instanceOf(Validator)
  },

  validate:function(grp, args){
    return this.context.validator.validate(grp, args)
  },

  validateField:function(name, args){
    return this.context.validator.validateField(name, args)
  }
}
