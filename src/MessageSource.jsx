'use strict';
var React = require('react')
  , cn = require('classnames')
  , connectToMessageContainer = require('./connectToMessageContainer');

var FormInput = React.createClass({

  propTypes: {
    events:     React.PropTypes.arrayOf(React.PropTypes.string),
    activeClass: React.PropTypes.string,
    for:        React.PropTypes.string.isRequired,
    group:      React.PropTypes.oneOfType([
                  React.PropTypes.string,
                  React.PropTypes.arrayOf(React.PropTypes.string)
                ])
  },

  contextTypes: {
    onValidateField: React.PropTypes.func,
    register:        React.PropTypes.func
  },

  getDefaultProps() {
    return {
      events: [ 'onChange' ],
      activeClass: 'message-active'
    };
  },

  getContext(){
    return process.env.NODE_ENV !== 'production' 
      ? this.context
      : this._reactInternalInstance._context
  },

  componentWillMount(){
    this._unregister = this.getContext().register(this.props.for, this.props.group, this)
  },

  componentWillUnmount() {
    this._unregister()
  },

  componentWillReceiveProps(nextProps) {
    this._unregister()
    this._unregister = this.getContext().register(nextProps.for, nextProps.group, this)
  },

  render() {
    var errClass = this.props.activeClass
      , active = this.props.active
      , child = React.Children.only(this.props.children);

    return React.cloneElement(child, { 

      ...this._events(child.props),

      name: this.props.for,
      
      className: cn(child.props.className, 'rv-form-input', { [errClass]: active })
    })
  },

  _events(childProps){
    var notify = this._notify;

    return this.props.events.reduce((map, evt) => {
      map[evt] = notify.bind(null, childProps[evt], evt)
      return map
    }, {})
  },

  _notify(handler, event, ...args){
    this.getContext()
      .onValidateField(this.props.for, event, this, args)

    handler 
      && handler.apply(this, args)
  }

});

module.exports = connectToMessageContainer(FormInput)

