'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ChildBridge = require('topeka/ChildBridge');

var _ChildBridge2 = _interopRequireDefault(_ChildBridge);

var _connectToMessageContainer = require('./connectToMessageContainer');

var _connectToMessageContainer2 = _interopRequireDefault(_connectToMessageContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var stringOrArrayOfStrings = _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.arrayOf(_react.PropTypes.string)]);

function isActive(names, messages) {
  return names.some(function (name) {
    return !!messages[name];
  });
}

var MessageTrigger = function (_React$Component) {
  _inherits(MessageTrigger, _React$Component);

  function MessageTrigger() {
    _classCallCheck(this, MessageTrigger);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args)));

    _initialiseProps.call(_this);

    _this.state = { isActive: false };
    return _this;
  }

  MessageTrigger.prototype.componentWillMount = function componentWillMount() {
    var _props = this.props;
    var isActive = _props.isActive;
    var messages = _props.messages;

    var props = _objectWithoutProperties(_props, ['isActive', 'messages']);

    this.addToGroup();
    this.setState({
      isActive: isActive.apply(undefined, [this.resolveNames(), messages].concat(props))
    });
  };

  MessageTrigger.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
    var isActive = nextProps.isActive;
    var messages = nextProps.messages;

    var props = _objectWithoutProperties(nextProps, ['isActive', 'messages']);

    this.addToGroup(nextProps, nextContext);
    this.setState({
      isActive: isActive(this.resolveNames(nextProps, nextContext), messages, props)
    });
  };

  MessageTrigger.prototype.componentWillUnmount = function componentWillUnmount() {
    this.removeFromGroup && this.removeFromGroup();
  };

  MessageTrigger.prototype.render = function render() {
    return _react2.default.createElement(
      _ChildBridge2.default,
      {
        inject: this.inject,
        events: this.props.events,
        onEvent: this.onEvent
      },
      this.props.children
    );
  };

  MessageTrigger.prototype.addToGroup = function addToGroup() {
    var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];
    var context = arguments.length <= 1 || arguments[1] === undefined ? this.context : arguments[1];
    var messageContainer = context.messageContainer;
    var forNames = props['for'];
    var group = props.group;


    this.removeFromGroup && this.removeFromGroup();

    if (!messageContainer || !forNames) return;

    this.removeFromGroup = messageContainer.addToGroup(group, forNames);
  };

  MessageTrigger.prototype.resolveNames = function resolveNames() {
    var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];
    var context = arguments.length <= 1 || arguments[1] === undefined ? this.context : arguments[1];
    var messageContainer = context.messageContainer;
    var forNames = props['for'];
    var group = props.group;

    // falsy groups will return all form fields

    if (!forNames && messageContainer) forNames = messageContainer.namesForGroup(group);

    return forNames ? [].concat(forNames) : [];
  };

  return MessageTrigger;
}(_react2.default.Component);

MessageTrigger.propTypes = {
  events: stringOrArrayOfStrings,
  inject: _react2.default.PropTypes.func,
  isActive: _react2.default.PropTypes.func.isRequired,

  for: stringOrArrayOfStrings,
  group: stringOrArrayOfStrings
};
MessageTrigger.contextTypes = {
  messageContainer: _react2.default.PropTypes.object
};
MessageTrigger.defaultProps = {
  isActive: isActive,
  events: 'onChange'
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onEvent = function (event, handler) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    var messageContainer = _this2.context.messageContainer;


    handler && handler.apply(_this2, args);

    if (!messageContainer) return;

    messageContainer.onValidate(_this2.resolveNames(), event, args);
  };

  this.inject = function (child) {
    var _props2 = _this2.props;
    var messages = _props2.messages;
    var inject = _props2.inject;
    var isActive = _props2.isActive;


    if (!inject) return false;
    var names = _this2.resolveNames();

    return inject(child, isActive(names, messages));
  };
};

exports.default = (0, _connectToMessageContainer2.default)(MessageTrigger);
module.exports = exports['default'];