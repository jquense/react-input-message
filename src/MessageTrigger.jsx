'use strict';
var React  = require('react')

var MessageTrigger = React.createClass({

  propTypes: {
    component: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.func
               ]).isRequired,
    group:  React.PropTypes.oneOfType([
              React.PropTypes.string,
              React.PropTypes.arrayOf(React.PropTypes.string)
            ])
  },

  contextTypes: {
    onValidateGroup: React.PropTypes.func,
    onValidateField: React.PropTypes.func,
  },

  getContext(){
    return process.env.NODE_ENV !== 'production' 
      ? this.context
      : this._reactInternalInstance._context
  },

  getDefaultProps() {
    return {
      component: 'button'
    }
  },

  render() {
    var { 
        children
      , component
      , ...props } = this.props;

    return React.createElement(
        component
      , { ...props, onClick: this._click }
      , children);
  },

  _click(...args){
    this.getContext().onValidateGroup(this.props.group, 'click', this, args)
      
    this.props.onClick 
      && this.props.onClick(...args)
  }

});

module.exports = MessageTrigger;
