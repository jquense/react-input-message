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

  getInitialState:function(){
    return this._getValidationState(this.context)
  },

  componentWillMount:function() {
    this._removeChangeListener = this.context
      .listen(function()  {return this.setState(this._getValidationState());}.bind(this))  
  },

  componentWillUnmount:function() {
    this._removeChangeListener()
  },

  _getValidationState:function(){
    var errors = this.context.errors(this.props.for);

    return { 
      errors: errors,
      valid: !errors || !Object.keys(errors).length
    }
  },
}
