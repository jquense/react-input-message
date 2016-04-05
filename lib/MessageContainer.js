'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var uniq = function uniq(array) {
  return array.filter(function (item, idx) {
    return array.indexOf(item) == idx;
  });
};

var has = function has(obj, key) {
  return obj && ({}).hasOwnProperty.call(obj, key);
};

module.exports = (function (_React$Component) {
  _inherits(ValidationContainer, _React$Component);

  _createClass(ValidationContainer, null, [{
    key: 'defaultProps',
    value: {
      messages: Object.create(null)
    },
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      messages: React.PropTypes.object,
      onValidationNeeded: React.PropTypes.func
    },
    enumerable: true
  }, {
    key: 'childContextTypes',
    value: {
      messageContainer: React.PropTypes.object
    },
    enumerable: true
  }]);

  function ValidationContainer(props, context) {
    _classCallCheck(this, ValidationContainer);

    _React$Component.call(this, props, context);
    this._handlers = [];
    this._groups = Object.create(null);

    this._messages = this._messages.bind(this);
  }

  ValidationContainer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this._emit(nextProps);
  };

  ValidationContainer.prototype.getChildContext = function getChildContext() {
    var _this = this;

    return this._context || (this._context = {

      messageContainer: {

        subscribe: function subscribe(listener) {
          _this._handlers.push(listener);
          listener(_this._listenerContext(_this.props));
          return function () {
            return _this._handlers.splice(_this._handlers.indexOf(listener), 1);
          };
        },

        addToGroup: function addToGroup(group, fields) {
          if (group === undefined) group = '';

          group = _this._groups[group] || (_this._groups[group] = []);
          fields = [].concat(fields);

          fields.forEach(function (f) {
            if (group.indexOf(f) === -1) group.push(f);
          });

          return function () {
            return fields.forEach(function (f) {
              return group.splice(group.indexOf(f), 1);
            });
          };
        },

        onValidateFields: function onValidateFields(fields, type, args) {
          _this.props.onValidationNeeded && _this.props.onValidationNeeded({ type: type, fields: fields, args: args });
        },

        onValidateGroup: function onValidateGroup(group, type, args) {
          var fields = _this.fieldsForGroup(group);
          _this.props.onValidationNeeded && _this.props.onValidationNeeded({ type: type, fields: fields, args: args });
        }
      }
    });
  };

  ValidationContainer.prototype._listenerContext = function _listenerContext(props) {
    return this._messages.bind(null, props.messages || {});
  };

  ValidationContainer.prototype.render = function render() {
    return this.props.children;
  };

  ValidationContainer.prototype.fieldsForGroup = function fieldsForGroup() {
    var _this2 = this;

    var groups = arguments.length <= 0 || arguments[0] === undefined ? Object.keys(this._groups) : arguments[0];

    groups = [].concat(groups);
    return uniq(groups.reduce(function (fields, group) {
      return fields.concat(_this2._groups[group]);
    }, []));
  };

  ValidationContainer.prototype._emit = function _emit(props) {
    var context = this._listenerContext(props);
    this._handlers.forEach(function (fn) {
      return fn(context);
    });
  };

  ValidationContainer.prototype._messages = function _messages(messages, names, groups) {
    if (!names || !names.length) {
      if (!groups || !groups.length) return _extends({}, messages);

      names = this.fieldsForGroup(groups);
    }

    return [].concat(names).reduce(function (o, name) {
      if (messages[name]) o[name] = messages[name];

      return o;
    }, {});
  };

  return ValidationContainer;
})(React.Component);