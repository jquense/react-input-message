'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var React = require('react'),
    ReactElement = require('react/lib/ReactElement');

var uniq = function uniq(array) {
  return array.filter(function (item, idx) {
    return array.indexOf(item) == idx;
  });
};

var has = function has(obj, key) {
  return obj && ({}).hasOwnProperty.call(obj, key);
};

module.exports = (function (_React$Component) {
  function ValidationContainer(props, context) {
    babelHelpers.classCallCheck(this, ValidationContainer);

    _React$Component.call(this, props, context);

    this._handlers = [];

    this._groups = Object.create(null);
    this._fields = Object.create(null);

    this.state = {
      children: getChildren(props, this.getChildContext())
    };
  }

  babelHelpers.inherits(ValidationContainer, _React$Component);

  ValidationContainer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState({
      children: getChildren(nextProps, this.getChildContext())
    });
  };

  ValidationContainer.prototype.componentDidMount = function componentDidMount() {
    this._emit();
  };

  ValidationContainer.prototype.componentDidUpdate = function componentDidUpdate() {
    this._emit();
  };

  ValidationContainer.prototype.getChildContext = function getChildContext() {
    var _this = this;

    // cache the value to avoid the damn owner/parent context warnings. TODO: remove in 0.14
    return this._context || (this._context = {

      messages: this._messages.bind(this),

      listen: function listen(fn) {
        _this._handlers.push(fn);
        return function () {
          return _this._handlers.splice(_this._handlers.indexOf(fn), 1);
        };
      },

      register: function register(names, group, target) {
        names = [].concat(names);

        names.forEach(function (name) {
          return _this.addField(name, group, target);
        });

        return function () {
          return names.forEach(function (name) {
            return _this.removeField(name, group);
          });
        };
      },

      onValidateFields: function onValidateFields(fields, event, target, args) {
        _this.props.onValidationNeeded && _this.props.onValidationNeeded({ event: event, fields: fields, args: args, target: target });
      },

      onValidateGroup: function onValidateGroup(group, event, target, args) {
        var fields = _this.fields(group);

        _this.props.onValidationNeeded && _this.props.onValidationNeeded({ event: event, fields: fields, args: args, target: target });
      }
    });
  };

  ValidationContainer.prototype.addField = function addField(name, group, target) {
    var _this2 = this;

    if (!name) return;

    this._fields[name] = target;

    if (!(!group || !group.length)) [].concat(group).forEach(function (grp) {
      if (!has(_this2._groups, grp)) return _this2._groups[grp] = [name];

      if (_this2._groups[grp].indexOf(name) === -1) _this2._groups[grp].push(name);
    });
  };

  ValidationContainer.prototype.removeField = function removeField(name, group) {
    var _this3 = this;

    var remove = function remove(name, group) {
      var idx = _this3._groups[group].indexOf(name);

      if (idx !== -1) _this3._groups[group].splice(idx, 1);
    };

    if (!name) return;

    if (group) return remove(name, group);

    for (var key in this._groups) if (has(this._groups, key)) remove(name, key);

    this._fields[name] = false;
  };

  ValidationContainer.prototype.render = function render() {
    return this.state.children;
  };

  ValidationContainer.prototype.fields = function fields(groups) {
    var _this4 = this;

    var isGroup = !(!groups || !groups.length);

    groups = [].concat(groups);

    return isGroup ? uniq(groups.reduce(function (fields, group) {
      return fields.concat(_this4._groups[group]);
    }, [])) : Object.keys(this._fields);
  };

  ValidationContainer.prototype._emit = function _emit() {
    this._handlers.forEach(function (fn) {
      return fn();
    });
  };

  ValidationContainer.prototype._messages = function _messages(names, groups) {
    var _this5 = this;

    if (!names || !names.length) {
      if (!groups || !groups.length) return babelHelpers._extends({}, this.props.messages);

      names = this.fields(groups);
    }

    return [].concat(names).reduce(function (o, name) {
      if (_this5.props.messages[name]) o[name] = _this5.props.messages[name];

      return o;
    }, {});
  };

  babelHelpers.createClass(ValidationContainer, null, [{
    key: 'defaultProps',
    value: {
      messages: Object.create(null)
    },
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      messages: React.PropTypes.object,
      onValidationNeeded: React.PropTypes.func.isRequired
    },
    enumerable: true
  }, {
    key: 'childContextTypes',
    value: {

      onValidateFields: React.PropTypes.func,
      onValidateGroup: React.PropTypes.func,

      messages: React.PropTypes.func,

      register: React.PropTypes.func,
      unregister: React.PropTypes.func,

      listen: React.PropTypes.func
    },
    enumerable: true
  }]);
  return ValidationContainer;
})(React.Component);

function getChildren(props, context) {

  if (process.env.NODE_ENV !== 'production') {
    // this is to avoid the warning but its hacky so lets do it a less hacky way in production
    return attachChildren(React.Children.only(props.children), context);
  } else return props.children;
}

function attachChildren(children, context) {

  if (typeof children === 'string' || React.isValidElement(children)) return clone(children);

  return React.Children.map(children, clone);

  function clone(child) {
    if (!React.isValidElement(child)) return child;

    var props = child.props;

    if (props.children) props = babelHelpers._extends({}, child.props, { children: attachChildren(props.children, context) });

    return new ReactElement(child.type, child.key, child.ref, child._owner, babelHelpers._extends({}, child._context, context), props);
  }
}