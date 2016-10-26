'use strict';

exports.__esModule = true;
exports.resolveNames = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function isReactComponent(component) {
  return !!(component && component.prototype && component.prototype.isReactComponent);
}

function defaultResolveNames(props, container) {
  var group = props.group;
  var forNames = props['for'];


  if (!forNames && container) forNames = container.namesForGroup(group);

  return forNames ? [].concat(forNames) : [];
}

function defaultMapMessages(messages, names) {
  if (!names.length) return messages;

  var messagesForNames = {};
  names.forEach(function (name) {
    if (messages[name]) messagesForNames[name] = messages[name];
  });

  return messagesForNames;
}

function connectToMessageContainer(Component) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref$methods = _ref.methods;
  var methods = _ref$methods === undefined ? [] : _ref$methods;
  var _ref$mapMessages = _ref.mapMessages;
  var mapMessages = _ref$mapMessages === undefined ? defaultMapMessages : _ref$mapMessages;
  var _ref$resolveNames = _ref.resolveNames;
  var resolveNames = _ref$resolveNames === undefined ? defaultResolveNames : _ref$resolveNames;


  function resolveNamesAndMapMessages(messages, props, container) {
    var names = resolveNames ? resolveNames(props, container) : [];

    return (props.mapMessages || mapMessages)(messages, names, props, container);
  }

  var MessageListener = function (_React$Component) {
    _inherits(MessageListener, _React$Component);

    function MessageListener() {
      _classCallCheck(this, MessageListener);

      return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    MessageListener.prototype.componentWillMount = function componentWillMount() {
      var _this2 = this;

      var container = this.context.messageContainer;

      if (container) {
        this.unsubscribe = container.subscribe(function (allMessages) {
          if (_this2.unmounted) return;

          var messages = resolveNamesAndMapMessages(allMessages, _this2.props, _this2.context.messageContainer);

          _this2.setState({ messages: messages, allMessages: allMessages });
        });
      }
    };

    MessageListener.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
      var _this3 = this;

      if (mapMessages && mapMessages.length >= 2) {
        (function () {
          var container = nextContext.messageContainer;
          // callback style because the listener may have been called before
          // and not had a chance to flush it's changes yet
          _this3.setState(function (_ref2) {
            var allMessages = _ref2.allMessages;
            return {
              messages: resolveNamesAndMapMessages(allMessages, nextProps, container)
            };
          });
        })();
      }
    };

    MessageListener.prototype.componentWillUnmount = function componentWillUnmount() {
      this.unmounted = true;
      this.unsubscribe && this.unsubscribe();
    };

    MessageListener.prototype.render = function render() {
      var _ref3 = this.state || {};

      var _ref3$messages = _ref3.messages;
      var messages = _ref3$messages === undefined ? {} : _ref3$messages;


      if (this.props.messages) {
        messages = this.props.messages;
      }

      return _react2.default.createElement(Component, _extends({}, this.props, {
        messages: messages,
        ref: isReactComponent(Component) ? 'inner' : undefined
      }));
    };

    return MessageListener;
  }(_react2.default.Component);

  MessageListener.DecoratedComponent = Component;
  MessageListener.propTypes = {
    mapMessages: _react2.default.PropTypes.func
  };
  MessageListener.contextTypes = {
    messageContainer: _react2.default.PropTypes.object
  };


  methods.forEach(function (method) {
    MessageListener.prototype[method] = function () {
      var _refs$inner;

      return (_refs$inner = this.refs.inner)[method].apply(_refs$inner, arguments);
    };
  });

  return MessageListener;
}

connectToMessageContainer.resolveNames = defaultResolveNames;

exports.resolveNames = defaultResolveNames;
exports.default = connectToMessageContainer;