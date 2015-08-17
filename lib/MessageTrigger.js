'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var React = require('react'),
    cn = require('classnames'),
    connectToMessageContainer = require('./connectToMessageContainer');

var stringOrArrayOfStrings = React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]);

var useRealContext = /^0\.14/.test(React.version);

var MessageTrigger = (function (_React$Component) {
  function MessageTrigger() {
    babelHelpers.classCallCheck(this, MessageTrigger);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  babelHelpers.inherits(MessageTrigger, _React$Component);

  MessageTrigger.prototype.getContext = function getContext() {
    return useRealContext ? this.context : this._reactInternalInstance._context;
  };

  MessageTrigger.prototype.componentWillMount = function componentWillMount() {
    this._unregister = this.getContext().register(this.props['for'], this.props.group, this);
  };

  MessageTrigger.prototype.componentWillUnmount = function componentWillUnmount() {
    this._unregister();
  };

  MessageTrigger.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this._unregister();
    this._unregister = this.getContext().register(nextProps['for'], nextProps.group, this);
  };

  MessageTrigger.prototype.render = function render() {
    var _cn;

    var errClass = this.props.activeClass,
        active = this.props['for'] && this.props.active,
        child = React.Children.only(this.props.children);

    return React.cloneElement(child, babelHelpers._extends({}, this._events(child.props), {

      className: cn(child.props.className, (_cn = {}, _cn[errClass] = active, _cn))
    }));
  };

  MessageTrigger.prototype._events = function _events(childProps) {
    var _this = this;

    var notify = this._notify;

    return this.props.events.reduce(function (map, evt) {
      map[evt] = notify.bind(_this, childProps[evt], evt);
      return map;
    }, {});
  };

  MessageTrigger.prototype._notify = function _notify(handler, event) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var context = this.getContext(),
        forProps = this.props['for'] ? [].concat(this.props['for']) : [];

    if (forProps.length) context.onValidateFields(forProps, event, this, args);else context.onValidateGroup(this.props.group, event, this, args);

    handler && handler.apply(this, args);
  };

  babelHelpers.createClass(MessageTrigger, null, [{
    key: 'propTypes',
    value: {
      events: React.PropTypes.arrayOf(React.PropTypes.string),
      activeClass: React.PropTypes.string,

      'for': stringOrArrayOfStrings,
      group: stringOrArrayOfStrings
    },
    enumerable: true
  }, {
    key: 'contextTypes',
    value: {
      onValidateFields: React.PropTypes.func,
      onValidateGroup: React.PropTypes.func,
      register: React.PropTypes.func
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      events: ['onChange'],
      activeClass: 'message-active'
    },
    enumerable: true
  }]);
  return MessageTrigger;
})(React.Component);

module.exports = connectToMessageContainer(MessageTrigger);

function requiredIfNot(propName, propType) {
  var type = React.PropTypes.string;

  return function (props, name, componentName) {
    var type = propType;

    if (!props.hasOwnProperty(propName)) type = type.isRequired;

    return type(props, name, componentName);
  };
}