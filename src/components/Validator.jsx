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
    this._validator = new Validator( 
      () => this.props.onValidate.apply(this, arguments))
  },

  // componentWillReceiveProps: function(nextProps) {
  //   this._validator.onValidate = nextProps.onValidate
  // },

  getChildContext: function() {
    return { 
      validator: this._validator
    }
  },

  render() {
    // var { children, ...props } = this.props;
    attachChildren(this.props.children, this.getChildContext())

    return this.props.children; 
  },

  validate(grp, args){
    return this._validator.validate(grp, args)
  },

  validateField(name, args){
    return this._validator.validateField(name, args)
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

