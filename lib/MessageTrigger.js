'use strict';

exports.__esModule = true;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ChildBridge = require('topeka/ChildBridge');

var _ChildBridge2 = _interopRequireDefault(_ChildBridge);

var _connectToMessageContainer = require('./connectToMessageContainer');

var _connectToMessageContainer2 = _interopRequireDefault(_connectToMessageContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var stringOrArrayOfStrings = _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.string)]);

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
    this.addToGroup();
  };

  MessageTrigger.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
    this.addToGroup(nextProps, nextContext);
  };

  MessageTrigger.prototype.componentWillUnmount = function componentWillUnmount() {
    this.removeFromGroup && this.removeFromGroup();
  };

  MessageTrigger.prototype.render = function render() {
    return _react2.default.createElement(
      _ChildBridge2.default,
      {
        events: this.props.events,
        onEvent: this.onEvent
      },
      this.inject
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

    return (0, _connectToMessageContainer.resolveNames)(this.props, context.messageContainer);
  };

  return MessageTrigger;
}(_react2.default.Component);

MessageTrigger.propTypes = {
  noValidate: _propTypes2.default.bool.isRequired,

  events: stringOrArrayOfStrings,

  for: stringOrArrayOfStrings,

  children: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.element]),

  group: function group(props, name, compName) {
    for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      args[_key2 - 3] = arguments[_key2];
    }

    if (!props[name] && (!props.for || !props.for.length)) {
      return new Error('A `group` prop is required when no `for` prop is provided' + ('for component ' + compName));
    }
    return stringOrArrayOfStrings.apply(undefined, [props, name, compName].concat(args));
  }
};
MessageTrigger.contextTypes = {
  messageContainer: _propTypes2.default.object
};
MessageTrigger.defaultProps = {
  events: 'onChange',
  noValidate: false
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onEvent = function (event) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    var _props = _this2.props;
    var children = _props.children;
    var noValidate = _props.noValidate;
    var messageContainer = _this2.context.messageContainer;

    var handler = _react2.default.isValidElement(children) && children.props[event];

    handler && handler.apply(_this2, args);

    if (noValidate || !messageContainer) return;

    messageContainer.onValidate(_this2.resolveNames(), event, args);
  };

  this.inject = function (props) {
    var _props2 = _this2.props;
    var messages = _props2.messages;
    var children = _props2.children;


    props.messages = messages;

    if (typeof children === 'function') return children(props);

    return _react2.default.cloneElement(children, props);
  };
};

exports.default = (0, _connectToMessageContainer2.default)(MessageTrigger);
module.exports = exports['default'];