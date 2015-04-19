"use strict";

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var React = require("react"),
    cn = require("classnames"),
    connectToMessageContainer = require("./connectToMessageContainer");

var values = function (obj) {
  return Object.keys(obj).map(function (k) {
    return obj[k];
  });
};
var flatten = function (arr, next) {
  return arr.concat(next);
};

var Message = (function (_React$Component) {
  function Message() {
    _classCallCheck(this, Message);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Message, _React$Component);

  Message.defaultProps = {
    component: "span",
    delim: ", "
  };

  Message.prototype.render = function render() {
    var _props = this.props;
    var Component = _props.component;
    var messages = _props.messages;
    var active = _props.active;
    var delim = _props.delim;
    var fieldFor = _props.for;

    var props = _objectWithoutProperties(_props, ["component", "messages", "active", "delim", "for"]);

    if (!active) return null;

    return React.createElement(
      Component,
      props,
      values(messages).reduce(flatten, []).join(delim)
    );
  };

  return Message;
})(React.Component);

module.exports = connectToMessageContainer(Message);
module.exports._Message = Message;