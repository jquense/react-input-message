'use strict';
var React = require('react')
  , cwp = require('react-clonewithprops')
  , assign = require('xtend');

var FormInput = React.createClass({displayName: "FormInput",

  mixins: [ 
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

  contextTypes: {
    onFieldValidate: React.PropTypes.func,
    register:        React.PropTypes.func,
    unregister:      React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      events: [ 'onChange' ],
      errorClass: 'field-error'
    };
  },


  componentWillMount:function(){
    this.context.register(this.props.for, this.props.group, this)
  },

  componentWillUnmount:function() {
    this.context.unregister(this.props.for)
  },

  componentWillReceiveProps:function(nextProps) {
    // in case anything has changed
    this.context.unregister(this.props.for)
    this.context.register(nextProps.for, nextProps.group, this)
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
      map[evt] = notify.bind(null, childProps[evt], evt)
      return map
    }, {})
  },

  _notify:function(handler, event ){for (var args=[],$__0=2,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
    handler && handler.apply(this, args)

    this.context.onFieldValidate(this.props.for, event, args)
  }

});

module.exports = FormInput

