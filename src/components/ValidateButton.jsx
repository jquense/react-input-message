'use strict';
var React = require('react')
  , assign  = require('xtend/mutable')

var FormButton = React.createClass({

  mixins: [ 
    require('./ValidationTriggerMixin') 
  ],

  propTypes: {
    component: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.func
               ]).isRequired,
    group:  React.PropTypes.oneOfType([
              React.PropTypes.string,
              React.PropTypes.arrayOf(React.PropTypes.string)
            ]).isRequired
  },

  getDefaultProps: function() {
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
      , assign(props, { onClick: this._click })
      , children);
  },

  _click(...args){
    this.validate(this.props.group, args)
      .catch( e => setTimeout( ()=>{ throw e }))
      
    this.props.onClick && this.props.onClick.apply(this, { args })
  }

});

module.exports = FormButton;
