"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");
var classnames = require("classnames");

var _require = require("react/lib/ReactElement");

var cloneAndReplaceProps = _require.cloneAndReplaceProps;

var FormInput = React.createClass({
  displayName: "FormInput",

  mixins: [require("./mixins/ValidationListener")],

  propTypes: {
    events: React.PropTypes.arrayOf(React.PropTypes.string),
    errorClass: React.PropTypes.string,
    for: React.PropTypes.string.isRequired,
    group: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)])
  },

  contextTypes: {
    onFieldValidate: React.PropTypes.func,
    register: React.PropTypes.func,
    unregister: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      events: ["onChange"],
      errorClass: "field-error"
    };
  },

  componentWillMount: function () {
    this.context.register(this.props.for, this.props.group, this);
  },

  componentWillUnmount: function () {
    this.context.unregister(this.props.for);
  },

  componentWillReceiveProps: function (nextProps) {
    // in case anything has changed
    this.context.unregister(this.props.for);
    this.context.register(nextProps.for, nextProps.group, this);
  },

  render: function () {
    var _this = this;

    var child = React.Children.only(this.props.children);

    return cloneAndReplaceProps(child, _extends({}, child.props, this._events(child.props), {
      name: this.props.for,
      className: classnames(child.props.className, "rv-form-input", (function () {
        var _classnames = {};
        _classnames[_this.props.errorClass] = !_this.state.valid;
        return _classnames;
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

    handler && handler.apply(this, args);

    this.context.onFieldValidate(this.props.for, event, args);
  }

});

module.exports = FormInput;