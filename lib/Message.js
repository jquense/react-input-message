'use strict';

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _connectToMessageContainer = require('./connectToMessageContainer');

var _connectToMessageContainer2 = _interopRequireDefault(_connectToMessageContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var values = function values(obj) {
  return Object.keys(obj).map(function (k) {
    return obj[k];
  });
};
var flatten = function flatten(arr, next) {
  return arr.concat(next);
};

var stringOrArrayOfStrings = _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]);

var Message = function (_React$Component) {
  _inherits(Message, _React$Component);

  function Message() {
    _classCallCheck(this, Message);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Message.prototype.render = function render() {
    var _props = this.props;
    var fieldFor = _props.for;
    var group
    /* eslint-enable no-unused-vars */
    = _props.group;
    var messages = _props.messages;
    var Component = _props.component;
    var children = _props.children;

    var props = _objectWithoutProperties(_props, ['for', 'group', 'messages', 'component', 'children']);

    if (!Object.keys(messages || {}).length) return null;

    return _react2.default.createElement(
      Component,
      props,
      children(values(messages).reduce(flatten, []))
    );
  };

  return Message;
}(_react2.default.Component);

Message.propTypes = {
  for: stringOrArrayOfStrings,
  group: stringOrArrayOfStrings,
  messagesForNames: _propTypes2.default.func,
  children: _propTypes2.default.func,
  component: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func])
};
Message.defaultProps = {
  component: 'span',
  children: function children(messages) {
    return messages.join(', ');
  }
};
Message.contextTypes = {
  messageContainer: _propTypes2.default.object
};


module.exports = (0, _connectToMessageContainer2.default)(Message);
module.exports._Message = Message;