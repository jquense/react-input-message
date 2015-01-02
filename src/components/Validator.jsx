'use strict';
var React = require('react');
var Validator = require('../Validator')
  , assign  = require('xtend/mutable')

var Form = React.createClass({

  propTypes: {
    onValidate: React.PropTypes.func.isRequired
  },

  childContextTypes: {
    validator: React.PropTypes.instanceOf(Validator)
  },

  componentWillMount: function() {
    this._validator = new Validator(this.props.onValidate)
  },

  componentWillReceiveProps: function(nextProps) {
    this._validator.setValidator(nextProps.onValidate)
  },

  getChildContext: function() {
    return { 
      validator: this._validator
    }
  },

  render: function() {
    // var { children, ...props } = this.props;
    attachChildren(this.props.children, this.getChildContext())

    return this.props.children; 
  }

});

module.exports = Form;


function attachChildren(children, context) {
  React.Children.forEach(children, child => {
    if( !React.isValidElement(child) ) 
      return 

    if( child.type.contextTypes )
      assign(child._context, context)
    
    if ( child.props.children) 
      attachChildren(child.props.children, context)
  });
}

