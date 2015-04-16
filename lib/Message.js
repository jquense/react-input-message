"use strict";

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var React = require("react"),
    cn = require("classnames"),
    connectToMessageContainer = require("./connectToMessageContainer");

var values = function (obj) {
  return Object.keys(obj).map(function (k) {
    return obj[k];
  });
};

var Message = (function () {
  function Message(props) {
    _classCallCheck(this, Message);

    this.props = props;
  }

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

    var props = _objectWithoutProperties(_props, ["component", "messages", "active", "delim"]);

    if (!active) return null;

    return React.createElement(
      Component,
      props,
      values(messages).join(delim)
    );
  };

  return Message;
})();

module.exports = connectToMessageContainer(Message);
module.exports._Message = Message;