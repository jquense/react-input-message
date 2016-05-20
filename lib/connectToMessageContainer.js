'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (Component) {
  var _class, _temp;

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
          _this2.setState({ messages: messages });
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
  }(_react2.default.Component), _class.DecoratedComponent = Component, _class.contextTypes = {
    messageContainer: _react2.default.PropTypes.object
  }, _temp;
};

module.exports = exports['default'];