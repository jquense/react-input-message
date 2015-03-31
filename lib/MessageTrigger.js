"use strict";

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");

var MessageTrigger = React.createClass({
  displayName: "MessageTrigger",

  propTypes: {
    component: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]).isRequired,
    group: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)])
  },

  contextTypes: {
    onValidateGroup: React.PropTypes.func,
    onValidateField: React.PropTypes.func },

  getContext: function () {
    return process.env.NODE_ENV !== "production" ? this.context : this._reactInternalInstance._context;
  },

  getDefaultProps: function () {
    return {
      component: "button"
    };
  },

  render: function () {
    var _props = this.props;
    var children = _props.children;
    var component = _props.component;

    var props = _objectWithoutProperties(_props, ["children", "component"]);

    return React.createElement(component, _extends({}, props, { onClick: this._click }), children);
  },

  _click: function () {
    var _props;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.getContext().onValidateGroup(this.props.group, "click", this, args);

    this.props.onClick && (_props = this.props).onClick.apply(_props, args);
  }

});

module.exports = MessageTrigger;