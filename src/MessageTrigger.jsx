'use strict';
var React = require('react')
  , cn = require('classnames')
  , connectToMessageContainer = require('./connectToMessageContainer');

var stringOrArrayOfStrings = React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.string)
    ])

class MessageTrigger extends React.Component{

  static propTypes = {
    events:      React.PropTypes.arrayOf(React.PropTypes.string),
    activeClass: React.PropTypes.string,

    for:   stringOrArrayOfStrings,
    group: stringOrArrayOfStrings
  }

  static contextTypes = {
    onValidateField: React.PropTypes.func,
    onValidateGroup: React.PropTypes.func,
    register:        React.PropTypes.func
  }

  static defaultProps = {
    events: [ 'onChange' ],
    activeClass: 'message-active'
  }


  getContext(){
    return process.env.NODE_ENV !== 'production' 
      ? this.context
      : this._reactInternalInstance._context
  }

  componentWillMount(){
    this._unregister = this.getContext().register(this.props.for, this.props.group, this)
  }

  componentWillUnmount() {
    this._unregister()
  }

  componentWillReceiveProps(nextProps) {
    this._unregister()
    this._unregister = this.getContext().register(nextProps.for, nextProps.group, this)
  }

  render() {
    var errClass = this.props.activeClass
      , active = this.props.for && this.props.active
      , child = React.Children.only(this.props.children);

    return React.cloneElement(child, { 

      ...this._events(child.props),
      
      className: cn(child.props.className, { [errClass]: active })
    })
  }

  _events(childProps){
    var notify = this._notify;

    return this.props.events.reduce((map, evt) => {
      map[evt] = notify.bind(this, childProps[evt], evt)
      return map
    }, {})
  }

  _notify(handler, event, ...args){
    var context = this.getContext()
      , forProps = this.props.for ? [].concat(this.props.for) : [];

    if( forProps.length )
      [].concat(forProps).forEach(path => context.onValidateField(path, event, this, args))
    else
      context.onValidateGroup(this.props.group, event, this, args)

    handler 
      && handler.apply(this, args)
  }
}

module.exports = connectToMessageContainer(MessageTrigger)

function requiredIfNot(propName, propType){
  var type = React.PropTypes.string

  return function(props, name, componentName){
    var type = propType

    if (!props.hasOwnProperty(propName))
      type = type.isRequired
    
    return type(props, name, componentName)
  }
}