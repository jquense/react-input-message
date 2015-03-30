'use strict';
var React = require('react');

module.exports = {

  contextTypes: {
    onValidateGroup: React.PropTypes.func,
    onValidateField: React.PropTypes.func,
  },

  getParentContext(){
    return this._reactInternalInstance._context
  }
}
