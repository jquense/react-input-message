'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react'),
    Bridge = require('topeka/ChildBridge'),
    connectToMessageContainer = require('./connectToMessageContainer');

var stringOrArrayOfStrings = React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]);

var MessageTrigger = (function (_React$Component) {
  _inherits(MessageTrigger, _React$Component);

  _createClass(MessageTrigger, null, [{
    key: 'propTypes',
    value: {
      events: stringOrArrayOfStrings,
      inject: React.PropTypes.func,

      'for': stringOrArrayOfStrings,
      group: stringOrArrayOfStrings
    },
    enumerable: true
  }, {
    key: 'contextTypes',
    value: {
      messageContainer: React.PropTypes.object
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      events: 'onChange'
    },
    enumerable: true
  }]);

  function MessageTrigger() {
    _classCallCheck(this, MessageTrigger);

    _React$Component.call(this);
    this._inject = this._inject.bind(this);
    this._notify = this._notify.bind(this);
  }

  MessageTrigger.prototype.componentWillMount = function componentWillMount() {
    if (!this.context.messageContainer || !this.props['for'] || !this.props['for'].length) return;

    this._removeFromGroup = this.context.messageContainer.addToGroup(this.props.group, this.props['for']);
  };

  MessageTrigger.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
    this._removeFromGroup && this._removeFromGroup();

    if (!nextContext.messageContainer || !nextProps['for'] || !nextProps['for'].length) return;

    this._removeFromGroup = this.context.messageContainer.addToGroup(nextProps.group, nextProps['for']);
  };

  MessageTrigger.prototype.componentWillUnmount = function componentWillUnmount() {
    this._removeFromGroup && this._removeFromGroup();
  };

  MessageTrigger.prototype.render = function render() {
    return React.createElement(
      Bridge,
      {
        inject: this._inject,
        events: this.props.events,
        onEvent: this._notify
      },
      this.props.children
    );
  };

  MessageTrigger.prototype._inject = function _inject(child) {
    var active = this.props['for'] && this.props.active;

    if (this.props.inject) return this.props.inject(child, !!active);
  };

  MessageTrigger.prototype._notify = function _notify(event, handler) {
    var container = this.context.messageContainer,
        forProps = this.props['for'] ? [].concat(this.props['for']) : [];

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    handler && handler.apply(this, args);

    if (!container) return;
    if (forProps.length) container.onValidateFields(forProps, event, args);else container.onValidateGroup(this.props.group, event, args);
  };

  return MessageTrigger;
})(React.Component);

module.exports = connectToMessageContainer(MessageTrigger);