'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var React = require('react');

var stringOrArrayofStrings = React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]);

var useRealContext = /^0\.14/.test(React.version);

module.exports = function (Component) {
  return (function (_React$Component) {
    function MessageListener() {
      babelHelpers.classCallCheck(this, MessageListener);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }

    babelHelpers.inherits(MessageListener, _React$Component);

    MessageListener.prototype.getContext = function getContext() {
      return useRealContext ? this.context : this._reactInternalInstance._context;
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
      return React.createElement(Component, babelHelpers._extends({}, this.props, this.state));
    };

    MessageListener.prototype._getValidationState = function _getValidationState() {
      var messages = this.getContext().messages(this.props['for'], this.props.group);

      return {
        messages: messages,
        active: !!(messages && Object.keys(messages).length)
      };
    };

    babelHelpers.createClass(MessageListener, null, [{
      key: 'propTypes',
      value: {
        'for': stringOrArrayofStrings,
        group: stringOrArrayofStrings
      },
      enumerable: true
    }, {
      key: 'contextTypes',
      value: {
        messages: React.PropTypes.func,
        listen: React.PropTypes.func
      },
      enumerable: true
    }]);
    return MessageListener;
  })(React.Component);
};