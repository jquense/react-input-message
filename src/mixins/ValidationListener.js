'use strict';
var React = require('react');

module.exports = {

  propTypes: {
    for: React.PropTypes.oneOfType([
           React.PropTypes.string,
           React.PropTypes.arrayOf(React.PropTypes.string)
         ]).isRequired
  },

  contextTypes: {
    errors: React.PropTypes.func,
    listen: React.PropTypes.func
  },

  getInitialState() {
    return this._getValidationState(this.context)
  },

  componentWillMount() {
    this._removeChangeListener = this.context
      .listen(() => this.setState(this._getValidationState()))  
  },

  componentWillUnmount() {
    this._removeChangeListener()
  },

  _getValidationState(){
    var errors = this.context.errors(this.props.for);

    return { 
      errors: errors,
      valid: !errors || !Object.keys(errors).length
    }
  },
}
