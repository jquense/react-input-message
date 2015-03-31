"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react"),
    cn = require("classnames"),
    connectToMessageContainer = require("./connectToMessageContainer");

var FormInput = React.createClass({
  displayName: "FormInput",

  propTypes: {
    events: React.PropTypes.arrayOf(React.PropTypes.string),
    activeClass: React.PropTypes.string,
    for: React.PropTypes.string.isRequired,
    group: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)])
  },

  contextTypes: {
    onValidateField: React.PropTypes.func,
    register: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      events: ["onChange"],
      activeClass: "message-active"
    };
  },

  getContext: function () {
    return process.env.NODE_ENV !== "production" ? this.context : this._reactInternalInstance._context;
  },

  componentWillMount: function () {
    this._unregister = this.getContext().register(this.props.for, this.props.group, this);
  },

  componentWillUnmount: function () {
    this._unregister();
  },

  componentWillReceiveProps: function (nextProps) {
    this._unregister();
    this._unregister = this.getContext().register(nextProps.for, nextProps.group, this);
  },

  render: function () {
    var errClass = this.props.activeClass,
        active = this.props.active,
        child = React.Children.only(this.props.children);

    return React.cloneElement(child, _extends({}, this._events(child.props), {

      name: this.props.for,

      className: cn(child.props.className, "rv-form-input", (function () {
        var _cn = {};
        _cn[errClass] = active;
        return _cn;
      })())
    }));
  },

  _events: function (childProps) {
    var notify = this._notify;

    return this.props.events.reduce(function (map, evt) {
      map[evt] = notify.bind(null, childProps[evt], evt);
      return map;
    }, {});
  },

  _notify: function (handler, event) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    this.getContext().onValidateField(this.props.for, event, this, args);

    handler && handler.apply(this, args);
  }

});

module.exports = connectToMessageContainer(FormInput);