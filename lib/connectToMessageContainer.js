'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var shallowEqual = require('./shallowEqual');

var stringOrArrayofStrings = React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]);

module.exports = function (Component) {
  return (function (_React$Component) {
    _inherits(MessageListener, _React$Component);

    function MessageListener() {
      _classCallCheck(this, MessageListener);

      _React$Component.apply(this, arguments);
    }

    MessageListener.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
      if (!(nextContext || {}).messageContainer) return true;
      if (!this.state && nextState) return true;
      if (this.state && !nextState) return true;
      if (this.state.active !== nextState.active) return true;

      return !shallowEqual(this.state.messages, nextState.messages) || !shallowEqual(this.props, nextProps);
    };

    MessageListener.prototype.componentWillMount = function componentWillMount() {
      var _this = this;

      var container = this.context.messageContainer;

      if (container) {
        this.unsubscribe = container.subscribe(function (getMessages) {
          _this.setState(_this._getValidationState(getMessages));
        });
      }
    };

    MessageListener.prototype.componentWillUnmount = function componentWillUnmount() {
      this.unsubscribe && this.unsubscribe();
    };

    MessageListener.prototype.render = function render() {
      return React.createElement(Component, _extends({}, this.props, this.state));
    };

    MessageListener.prototype._getValidationState = function _getValidationState(getMessages) {
      var messages = getMessages(this.props['for'], this.props.group);

      return {
        messages: messages,
        active: !!(messages && Object.keys(messages).length)
      };
    };

    _createClass(MessageListener, null, [{
      key: 'DecoratedComponent',
      value: Component,
      enumerable: true
    }, {
      key: 'propTypes',
      value: {
        'for': stringOrArrayofStrings,
        group: stringOrArrayofStrings
      },
      enumerable: true
    }, {
      key: 'contextTypes',
      value: {
        messageContainer: React.PropTypes.object
      },
      enumerable: true
    }]);

    return MessageListener;
  })(React.Component);
};