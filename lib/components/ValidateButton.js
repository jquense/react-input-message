'use strict';
var React  = require('react')
  , assign = require('xtend/mutable')

var FormButton = React.createClass({displayName: "FormButton",

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
            ])
  },

  getDefaultProps: function() {
    return {
      component: 'button'
    }
  },

  render:function() {
    var $__0= 
        
       
          this.props,children=$__0.children,component=$__0.component,props=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{children:1,component:1});

    return React.createElement(
        component
      , assign(props, { onClick: this._click })
      , children);
  },

  _click:function(){for (var args=[],$__0=0,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
    this.validate(this.props.group, args)
      .catch( function(e)  {return setTimeout( function(){ throw e });})
      
    this.props.onClick && this.props.onClick.apply(this, { args:args })
  }

});

module.exports = FormButton;
