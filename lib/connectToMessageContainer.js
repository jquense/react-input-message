var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");

var stringOrArrayofStrings = React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]);

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
      for: stringOrArrayofStrings,
      group: stringOrArrayofStrings
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
      return React.createElement(Component, _extends({}, this.props, this.state));
    };

    MessageListener.prototype._getValidationState = function _getValidationState() {
      var messages = this.getContext().messages(this.props.for, this.props.group);

      return {
        messages: messages,
        active: !!(messages && Object.keys(messages).length)
      };
    };

    return MessageListener;
  })(React.Component);
};