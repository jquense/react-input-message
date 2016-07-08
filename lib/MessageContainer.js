'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _connectToMessageContainer = require('./connectToMessageContainer');

var _connectToMessageContainer2 = _interopRequireDefault(_connectToMessageContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var uniq = function uniq(array) {
  return array.filter(function (item, idx) {
    return array.indexOf(item) === idx;
  });
};

var add = function add(array, item) {
  return array.indexOf(item) === -1 && array.push(item);
};

var remove = function remove(array, item) {
  return array.filter(function (i) {
    return i !== item;
  });
};

var ALL_FIELDS = '@all';

var MessageContainer = function (_React$Component) {
  _inherits(MessageContainer, _React$Component);

  function MessageContainer() {
    _classCallCheck(this, MessageContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args)));

    _initialiseProps.call(_this);

    _this._handlers = [];
    _this._groups = Object.create(null);
    return _this;
  }

  MessageContainer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this._emit(nextProps);
  };

  MessageContainer.prototype.getChildContext = function getChildContext() {
    if (!this._context) this._context = {
      messageContainer: {
        addToGroup: this.addToGroup,
        namesForGroup: this.namesForGroup,
        subscribe: this.subscribe,
        onValidate: this.onValidate
      }
    };

    return this._context;
  };

  MessageContainer.prototype._emit = function _emit(props) {
    var context = this._listenerContext(props);
    this._handlers.forEach(function (fn) {
      return fn(context);
    });
  };

  MessageContainer.prototype._listenerContext = function _listenerContext(_ref) {
    var messages = _ref.messages;

    return messages;
  };

  MessageContainer.prototype.render = function render() {
    return this.props.children;
  };

  return MessageContainer;
}(_react2.default.Component);

MessageContainer.propTypes = {
  passthrough: _react2.default.PropTypes.bool,
  mapNames: _react2.default.PropTypes.func,
  messages: _react2.default.PropTypes.object,
  onValidationNeeded: _react2.default.PropTypes.func
};
MessageContainer.defaultProps = {
  messages: Object.create(null),
  mapNames: function mapNames(names) {
    return names;
  }
};
MessageContainer.contextTypes = {
  messageContainer: _react2.default.PropTypes.object
};
MessageContainer.childContextTypes = {
  messageContainer: _react2.default.PropTypes.object
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.namesForGroup = function (groups) {
    groups = groups ? [].concat(groups) : [];

    if (groups.indexOf(ALL_FIELDS) !== -1) {
      groups = Object.keys(_this2._groups);
    }

    return uniq(groups.reduce(function (fields, group) {
      return fields.concat(_this2._groups[group]);
    }, []));
  };

  this.addToGroup = function (grpName, names) {
    if (grpName === ALL_FIELDS) return;

    grpName = grpName || '@@unassigned-group';

    names = names && [].concat(names);

    var group = _this2._groups[grpName];

    if (!names || !names.length) return;

    if (!group) group = _this2._groups[grpName] = [];

    names.forEach(function (name) {
      return add(group, name);
    });

    return function () {
      return names.forEach(function (name) {
        return remove(group, name);
      });
    };
  };

  this.onValidate = function (fields, type, args) {
    if (!fields || !fields.length) return;

    var _props = _this2.props;
    var mapNames = _props.mapNames;
    var passthrough = _props.passthrough;
    var messageContainer = _this2.context.messageContainer;


    if (messageContainer && passthrough) {
      messageContainer.onValidate(mapNames(fields), type, args);
    }

    _this2.props.onValidationNeeded && _this2.props.onValidationNeeded({ type: type, fields: fields, args: args });
  };

  this.subscribe = function (listener) {
    var context = _this2._listenerContext(_this2.props);

    _this2._handlers.push(listener);

    listener(context);

    return function () {
      return remove(_this2._handlers, listener);
    };
  };
};

exports.default = (0, _connectToMessageContainer2.default)(MessageContainer, {
  resolveNames: function resolveNames() {},
  mapMessages: function mapMessages(messages) {
    return messages;
  },
  methods: ['namesForGroup', 'addToGroup']
});
module.exports = exports['default'];