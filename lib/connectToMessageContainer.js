var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");

module.exports = function (Component) {
  return (function (_React$Component) {
    function MessageListener() {
      _classCallCheck(this, MessageListener);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }

    _inherits(MessageListener, _React$Component);

    MessageListener.propTypes = {

      for: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)])
    };
    MessageListener.contextTypes = {
      messages: React.PropTypes.func,
      listen: React.PropTypes.func
    };

    MessageListener.prototype.getContext = function getContext() {
      return process.env.NODE_ENV !== "production" ? this.context : this._reactInternalInstance._context;
    };

    MessageListener.prototype.componentWillMount = function componentWillMount() {
      var _this = this;

      this._removeChangeListener = this.getContext().listen(function () {
        return _this.setState(_this._getValidationState());
      });

      this.setState(this._getValidationState());
    };

    MessageListener.prototype.componentWillUnmount = function componentWillUnmount() {
      this._removeChangeListener();
    };

    MessageListener.prototype.render = function render() {
      var _props = this.props;
      var fieldFor = _props.for;

      var props = _objectWithoutProperties(_props, ["for"]);

      return React.createElement(Component, _extends({}, props, this.state));
    };

    MessageListener.prototype._getValidationState = function _getValidationState() {
      if (!this.props.for) return {};

      var messages = this.getContext().messages(this.props.for);

      return {
        messages: messages,
        active: !!(messages && Object.keys(messages).length)
      };
    };

    return MessageListener;
  })(React.Component);
};