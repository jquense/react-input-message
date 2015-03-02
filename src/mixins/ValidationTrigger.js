'use strict';
var React = require('react');

module.exports = {

  contextTypes: {
    validate:       React.PropTypes.func,
    validateField:  React.PropTypes.func,
  },

  validate(grp, args){
    return this.context.validate(grp, args)
  },

  validateField(name, args){
    return this.context.validateField(name, args)
  }
}
