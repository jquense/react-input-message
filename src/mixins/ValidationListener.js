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

  getParentContext(){
    return this._reactInternalInstance._context
  },

  componentWillMount() {
    this._removeChangeListener = this.getParentContext()
      .listen(() => this.setState(this._getValidationState()))  

    this.setState(this._getValidationState())
  },

  componentWillUnmount() {
    this._removeChangeListener()
  },

  _getValidationState(){
    var errors = this.getParentContext().errors(this.props.for);

    return { 
      errors: errors,
      valid: !errors || !Object.keys(errors).length
    }
  },
}
