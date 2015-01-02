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
    validator: React.PropTypes.instanceOf(Validator)
  },

  componentWillMount() {
    this._change = () => this.setState(this._getValidationState())
    this.context.validator
      .on('change',this._change )  
  },

  componentWillUnmount() {
    this.context.validator.off('change', this._change)
  },

  getInitialState(){
    return this._getValidationState()
  },

  _getValidationState(){
    var errors = this.context.validator.errors(this.props.for);

    return { 
      errors: errors,
      valid: !errors || !Object.keys(errors).length
    }
  },
}
