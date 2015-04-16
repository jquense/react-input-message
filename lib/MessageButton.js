"use strict";

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var React = require("react"),
    MessageTrigger = require("./MessageTrigger");

var MessageButton = (function (_React$Component) {
  function MessageButton() {
    _classCallCheck(this, MessageButton);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  _inherits(MessageButton, _React$Component);

  MessageButton.propTypes = {

    group: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)])
  };

  MessageButton.prototype.render = function render() {
    var _props = this.props;
    var children = _props.children;
    var group = _props.group;

    var props = _objectWithoutProperties(_props, ["children", "group"]);

    return React.createElement(
      MessageTrigger,
      { group: group, events: ["onClick"] },
      React.createElement(
        "button",
        props,
        this.props.children
      )
    );
  };

  return MessageButton;
})(React.Component);

module.exports = MessageButton;