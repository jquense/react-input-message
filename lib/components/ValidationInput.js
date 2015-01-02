'use strict';
var React = require('react')
  , cwp = require('react-clonewithprops')
  , assign = require('xtend');

var FormInput = React.createClass({displayName: "FormInput",

  mixins: [ 
    require('./ValidationTriggerMixin'),
    require('./ValidationListenerMixin')
  ],

  propTypes: {
    events: React.PropTypes.arrayOf(React.PropTypes.string),
    errorClass: React.PropTypes.string,
    for:    React.PropTypes.string.isRequired,
    group:  React.PropTypes.oneOfType([
              React.PropTypes.string,
              React.PropTypes.arrayOf(React.PropTypes.string)
            ])
  },

  getDefaultProps: function() {
    return {
      events: [ 'onChange' ],
      errorClass: 'field-error'
    };
  },

  componentWillMount:function(){
    this.context.validator.register(this.props.for, this.props.group, this)
  },

  componentWillUnmount:function() {
    this.context.validator.unregister(this.props.for)
  },

  componentWillReceiveProps:function(nextProps) {
    // in case anything has changed
    this.context.validator.unregister(this.props.for)
    this.context.validator.register(nextProps.for, nextProps.group, this)
  },

  render:function() {
    var child = React.Children.only(this.props.children);

    return cwp(child, assign(this._events(child.props), {
      name: this.props.for,
      ref:  child.ref,
      className: 'rv-form-input' + (!this.state.valid ? (' ' + this.props.errorClass) : '')
    }))
  },

  _events: function(childProps){
    var notify = this._notify;

    return this.props.events.reduce(function(map, evt)  {
      map[evt] = notify.bind(null, childProps[evt])
      return map
    }, {})
  },

  _notify:function(handler ){for (var args=[],$__0=1,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
    handler && handler.apply(this, args)
    this.validateField(this.props.for)
      .catch( function(e)  {return setTimeout( function(){ throw e });})
  }

});

module.exports = FormInput

