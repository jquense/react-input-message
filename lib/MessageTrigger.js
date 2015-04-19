"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var React = require("react"),
    cn = require("classnames"),
    connectToMessageContainer = require("./connectToMessageContainer");

var MessageTrigger = (function (_React$Component) {
  function MessageTrigger() {
    _classCallCheck(this, MessageTrigger);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(MessageTrigger, _React$Component);

  MessageTrigger.propTypes = {
    events: React.PropTypes.arrayOf(React.PropTypes.string),
    activeClass: React.PropTypes.string,

    for: React.PropTypes.string,

    group: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)])
  };
  MessageTrigger.contextTypes = {
    onValidateField: React.PropTypes.func,
    onValidateGroup: React.PropTypes.func,
    register: React.PropTypes.func
  };
  MessageTrigger.defaultProps = {
    events: ["onChange"],
    activeClass: "message-active"
  };

  MessageTrigger.prototype.getContext = function getContext() {
    return process.env.NODE_ENV !== "production" ? this.context : this._reactInternalInstance._context;
  };

  MessageTrigger.prototype.componentWillMount = function componentWillMount() {
    this._unregister = this.getContext().register(this.props.for, this.props.group, this);
  };

  MessageTrigger.prototype.componentWillUnmount = function componentWillUnmount() {
    this._unregister();
  };

  MessageTrigger.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this._unregister();
    this._unregister = this.getContext().register(nextProps.for, nextProps.group, this);
  };

  MessageTrigger.prototype.render = function render() {
    var errClass = this.props.activeClass,
        active = this.props.for && this.props.active,
        child = React.Children.only(this.props.children);

    return React.cloneElement(child, _extends({}, this._events(child.props), {

      className: cn(child.props.className, (function () {
        var _cn = {};
        _cn[errClass] = active;
        return _cn;
      })())
    }));
  };

  MessageTrigger.prototype._events = function _events(childProps) {
    var _this = this;

    var notify = this._notify;

    return this.props.events.reduce(function (map, evt) {
      map[evt] = notify.bind(_this, childProps[evt], evt);
      return map;
    }, {});
  };

  MessageTrigger.prototype._notify = function _notify(handler, event) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var context = this.getContext();

    if (this.props.for) context.onValidateField(this.props.for, event, this, args);else context.onValidateGroup(this.props.group, event, this, args);

    handler && handler.apply(this, args);
  };

  return MessageTrigger;
})(React.Component);

module.exports = connectToMessageContainer(MessageTrigger);

function requiredIfNot(propName, propType) {
  var type = React.PropTypes.string;

  return function (props, name, componentName) {
    var type = propType;

    if (!props.hasOwnProperty(propName)) type = type.isRequired;

    return type(props, name, componentName);
  };
}