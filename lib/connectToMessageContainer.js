'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

function mapMessages(messages, resolveNames, props, container) {
  var names = resolveNames ? resolveNames(props, container) : [];
  var mapMessages = props.mapMessages;


  return (mapMessages || defaultMapMessages)(messages, names, props, container);
}

exports.default = function (Component) {
  var _class, _temp;

  var resolveNames = arguments.length <= 1 || arguments[1] === undefined ? defaultResolveNames : arguments[1];
  return _temp = _class = function (_React$Component) {
    _inherits(MessageListener, _React$Component);

    function MessageListener() {
      _classCallCheck(this, MessageListener);

      return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    MessageListener.prototype.componentWillMount = function componentWillMount() {
      var _this2 = this;

      var container = this.context.messageContainer;

      if (container) {
        this.unsubscribe = container.subscribe(function (messages) {
          messages = mapMessages(messages, resolveNames, _this2.props, container);

          _this2.setState({ messages: messages });
        });
      }
    };

    MessageListener.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
      if (mapMessages && mapMessages.length >= 2) {
        var container = nextContext.messageContainer;
        this.setState({
          messages: mapMessages(this.state.messages, resolveNames, nextProps, container)
        });
      }
    };

    MessageListener.prototype.componentWillUnmount = function componentWillUnmount() {
      this.unsubscribe && this.unsubscribe();
    };

    MessageListener.prototype.render = function render() {
      return _react2.default.createElement(Component, _extends({}, this.props, this.state));
    };

    return MessageListener;
  }(_react2.default.Component), _class.DecoratedComponent = Component, _class.propTypes = {
    mapMessages: _react2.default.PropTypes.func
  }, _class.contextTypes = {
    messageContainer: _react2.default.PropTypes.object
  }, _temp;
};

module.exports = exports['default'];