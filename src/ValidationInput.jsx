'use strict';
var React = require('react')
  , classnames = require('classnames')
  , { cloneAndReplaceProps } = require('react/lib/ReactElement');

var FormInput = React.createClass({

  mixins: [ 
    require('./mixins/ValidationListener')
  ],

  propTypes: {
    events:     React.PropTypes.arrayOf(React.PropTypes.string),
    errorClass: React.PropTypes.string,
    for:        React.PropTypes.string.isRequired,
    group:      React.PropTypes.oneOfType([
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


  componentWillMount(){
    this.context.register(this.props.for, this.props.group, this)
  },

  componentWillUnmount() {
    this.context.unregister(this.props.for)
  },

  componentWillReceiveProps(nextProps) {
    // in case anything has changed
    this.context.unregister(this.props.for)
    this.context.register(nextProps.for, nextProps.group, this)
  },

  render() {
    var child = React.Children.only(this.props.children);

    return cloneAndReplaceProps(child, { 
      ...child.props, 
      ...this._events(child.props),
      name: this.props.for,
      className: classnames(child.props.className, 'rv-form-input', { 
        
        [this.props.errorClass]: !this.state.valid 
      })
    })
  },

  _events: function(childProps){
    var notify = this._notify;

    return this.props.events.reduce((map, evt) => {
      map[evt] = notify.bind(null, childProps[evt], evt)
      return map
    }, {})
  },

  _notify(handler, event, ...args){
    handler && handler.apply(this, args)

    this.context.onFieldValidate(this.props.for, event, args)
  }

});

module.exports = FormInput

