'use strict';

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

function messagesForNames(names, messages) {
  var messagesForNames = {};

  names.forEach(function (name) {
    if (messages[name]) messagesForNames[name] = messages[name];
  });

  return messagesForNames;
}

var stringOrArrayOfStrings = _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.arrayOf(_react.PropTypes.string)]);

var Message = function (_React$Component) {
  _inherits(Message, _React$Component);

  function Message() {
    _classCallCheck(this, Message);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Message.prototype.componentWillMount = function componentWillMount() {
    this.setState(this.getMessageState(this.props, this.context));
  };

  Message.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
    this.setState(this.getMessageState(nextProps, nextContext));
  };

  Message.prototype.getMessageState = function getMessageState(props, context) {
    var messagesForNames = props.messagesForNames;
    var messages = props.messages;

    var args = _objectWithoutProperties(props, ['messagesForNames', 'messages']);

    var names = this.resolveNames(props, context);

    messages = names == null ? messages : messagesForNames(names, messages, args);

    return { messages: messages };
  };

  Message.prototype.render = function render() {
    var _props = this.props;
    var
    /* eslint-disable no-unused-vars */
    messages = _props.messages;
    var fieldFor = _props.for;
    var Component = _props.component;
    var children = _props.children;

    var props = _objectWithoutProperties(_props, ['messages', 'for', 'component', 'children']);

    var activeMessages = this.state.messages;

    if (!Object.keys(activeMessages || {}).length) return null;

    return _react2.default.createElement(
      Component,
      props,
      children(values(activeMessages).reduce(flatten, []))
    );
  };

  Message.prototype.resolveNames = function resolveNames(props, context) {
    var messageContainer = context.messageContainer;
    var forNames = props['for'];
    var group = props.group;


    if (!forNames) {
      if (!group || !messageContainer) return null;

      forNames = messageContainer.namesForGroup(group);
    }
    return forNames ? [].concat(forNames) : [];
  };

  return Message;
}(_react2.default.Component);

Message.propTypes = {
  for: stringOrArrayOfStrings,
  group: stringOrArrayOfStrings,
  messagesForNames: _react.PropTypes.func,
  children: _react.PropTypes.func,
  component: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func])
};
Message.defaultProps = {
  messagesForNames: messagesForNames,
  component: 'span',
  children: function children(messages) {
    return messages.join(', ');
  }
};
Message.contextTypes = {
  messageContainer: _react2.default.PropTypes.object
};


module.exports = (0, _connectToMessageContainer2.default)(Message);
module.exports._Message = Message;