"use strict";

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var React = require("react"),
    connectToMessageContainer = require("./connectToMessageContainer");

var Message = (function (_React$Component) {
  function Message() {
    _classCallCheck(this, Message);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(Message, _React$Component);

  Message.defaultProps = {
    component: "span"
  };

  Message.prototype.render = function render() {
    var classes = "rv-validation-message",
        errors = this.props.messages;

    errors = Object.keys(errors).reduce(function (errs, grp) {
      return errs.concat(errors[grp]);
    }, []);

    if (this.props.active) classes += " field-error";

    return React.createElement(this.props.component, {
      className: classes }, errors.join(", "));
  };

  return Message;
})(React.Component);

module.exports = connectToMessageContainer(Message);