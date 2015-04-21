"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var React = require("react"),
    ReactElement = require("react/lib/ReactElement");

var Promise = require("es6-promise").Promise,
    uniq = function (array) {
  return array.filter(function (item, idx) {
    return array.indexOf(item) == idx;
  });
};

var has = function (obj, key) {
  return obj && ({}).hasOwnProperty.call(obj, key);
};

module.exports = (function (_React$Component) {
  function ValidationContainer(props, context) {
    _classCallCheck(this, ValidationContainer);

    _React$Component.call(this, props, context);

    this._handlers = [];

    this._groups = Object.create(null);
    this._fields = Object.create(null);

    this.state = {
      children: getChildren(props, this.getChildContext())
    };
  }

  _inherits(ValidationContainer, _React$Component);

  ValidationContainer.defaultProps = {
    messages: Object.create(null)
  };
  ValidationContainer.propTypes = {
    messages: React.PropTypes.object,
    onValidationNeeded: React.PropTypes.func.isRequired
  };
  ValidationContainer.childContextTypes = {

    onValidateField: React.PropTypes.func,
    onValidateGroup: React.PropTypes.func,

    messages: React.PropTypes.func,

    register: React.PropTypes.func,
    unregister: React.PropTypes.func,

    listen: React.PropTypes.func
  };

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

      listen: function (fn) {
        _this._handlers.push(fn);
        return function () {
          return _this._handlers.splice(_this._handlers.indexOf(fn), 1);
        };
      },

      register: function (names, group, target) {
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

      onValidateField: function (field, event, target, args) {
        _this.props.onValidationNeeded && _this.props.onValidationNeeded({ event: event, field: field, args: args, target: target });
      },

      onValidateGroup: function (group, event, target, args) {
        var inputs = _this.fields(group);

        inputs.forEach(function (field) {
          _this.props.onValidationNeeded && _this.props.onValidationNeeded({ event: event, field: field, args: args, target: _this._fields[field] });
        });
      }
    });
  };

  ValidationContainer.prototype.addField = function addField(name, group, target) {
    var _this = this;

    if (!name) return;

    this._fields[name] = target;

    if (!(!group || !group.length)) [].concat(group).forEach(function (grp) {
      if (!has(_this._groups, grp)) return _this._groups[grp] = [name];

      if (_this._groups[grp].indexOf(name) === -1) _this._groups[grp].push(name);
    });
  };

  ValidationContainer.prototype.removeField = function removeField(name, group) {
    var _this = this;

    var remove = function (name, group) {
      var idx = _this._groups[group].indexOf(name);

      if (idx !== -1) _this._groups[group].splice(idx, 1);
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
    var _this = this;

    var isGroup = !(!groups || !groups.length);

    groups = [].concat(groups);

    return isGroup ? uniq(groups.reduce(function (fields, group) {
      return fields.concat(_this._groups[group]);
    }, [])) : Object.keys(this._fields);
  };

  ValidationContainer.prototype._emit = function _emit() {
    this._handlers.forEach(function (fn) {
      return fn();
    });
  };

  ValidationContainer.prototype._messages = function _messages(names, groups) {
    var _this = this;

    if (!names || !names.length) {
      if (!groups || !groups.length) return _extends({}, this.props.messages);

      names = this.fields(groups);
    }

    return [].concat(names).reduce(function (o, name) {
      if (_this.props.messages[name]) o[name] = _this.props.messages[name];

      return o;
    }, {});
  };

  return ValidationContainer;
})(React.Component);

function getChildren(props, context) {

  if (process.env.NODE_ENV !== "production") {
    // this is to avoid the warning but its hacky so lets do it a less hacky way in production
    return attachChildren(React.Children.only(props.children), context);
  } else return props.children;
}

function attachChildren(children, context) {

  if (typeof children === "string" || React.isValidElement(children)) return clone(children);

  return React.Children.map(children, clone);

  function clone(child) {
    var props = child.props;

    if (!React.isValidElement(child)) return child;

    if (props.children) props = _extends({}, child.props, { children: attachChildren(props.children, context) });

    return new ReactElement(child.type, child.key, child.ref, child._owner, _extends({}, child._context, context), props);
  }
}