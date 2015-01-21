'use strict';
var React = require('react')
var Validator = require('../Validator');

module.exports = {

  propTypes: {
    for: React.PropTypes.oneOfType([
           React.PropTypes.string,
           React.PropTypes.arrayOf(React.PropTypes.string)
         ]).isRequired
  },

  contextTypes: {
    errors:         React.PropTypes.func
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(this._getValidationState(this.context))
  },

  getInitialState(){
    return this._getValidationState(this.context)
  },

  _getValidationState(ctx){
    var errors = ctx.errors(this.props.for);

    return { 
      errors: errors,
      valid: !errors || !Object.keys(errors).length
    }
  },
}
