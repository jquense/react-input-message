"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react"),
    ReactElement = require("react/lib/ReactElement");

var Promise = require("es6-promise").Promise,
    uniq = require("array-uniq");

module.exports = React.createClass({

  displayName: "Validator",

  propTypes: {
    onValidate: React.PropTypes.func,
    validate: React.PropTypes.func.isRequired
  },

  childContextTypes: {
    validate: React.PropTypes.func,
    validateField: React.PropTypes.func,
    onFieldValidate: React.PropTypes.func,
    errors: React.PropTypes.func,
    register: React.PropTypes.func,
    unregister: React.PropTypes.func,
    listen: React.PropTypes.func
  },

  componentWillMount: function () {
    this._inputs = {};
    this._groups = {};
    this._errors = {};
    this._handlers = [];
  },

  getInitialState: function () {
    return {
      errors: {},
      children: attachChildren(React.Children.only(this.props.children), this.getChildContext())
    };
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      children: attachChildren(React.Children.only(nextProps.children), this.getChildContext())
    });
  },

  getChildContext: function () {
    var _this = this;

    var _arguments = arguments;

    // cache the value to avoid the damn owner/parent context warnings. TODO: remove in 0.14
    return this._context || (this._context = {
      errors: this.errors,
      validate: this.validate,
      validateField: this.validateField,

      listen: function (fn) {
        _this._handlers.push(fn);
        return function () {
          return _this._handlers.splice(_this._handlers.indexOf(fn), 1);
        };
      },

      register: function (name, group, component) {
        if (_arguments.length === 2) component = group, group = null;

        _this._inputs[name] = component;

        if (!(!group || !group.length)) [].concat(group).forEach(function (grp) {
          if (!_this._groups.hasOwnProperty(grp)) return _this._groups[grp] = [name];

          if (_this._groups[grp].indexOf(name) === -1) _this._groups[grp].push(name);
        });
      },

      onFieldValidate: function (field, event, args) {
        var prevented = false;

        _this.props.onValidate && _this.props.onValidate({
          event: event, field: field, args: args,
          input: _this._inputs[field],
          preventDefault: function () {
            prevented = true;
          }
        });

        if (!prevented) _this.validateField(field).catch(function (e) {
          return setTimeout(function () {
            throw e;
          });
        });
      },

      unregister: function (name, grp) {
        var remove = function (name, grp) {
          var idx = _this._groups[grp].indexOf(name);
          if (idx !== -1) _this._groups[grp].splice(idx, 1);
        };

        if (grp) return remove(name, grp);

        for (var key in _this._groups) if (_this._groups.hasOwnProperty(key)) remove(name, key);

        delete _this._inputs[name];
      }
    });
  },

  render: function () {
    return this.state.children;
  },

  errors: function (names) {
    var _this = this;

    if (!names || !names.length) return _extends({}, this._errors);

    return [].concat(names).reduce(function (o, name) {
      if (_this._errors[name]) o[name] = _this._errors[name];

      return o;
    }, {});
  },

  isValid: function (name) {
    return !this._errors[name] || !this._errors[name].length;
  },

  _emit: function () {
    this._handlers.forEach(function (fn) {
      return fn();
    });
  },

  validate: function (grp, args) {
    var _this = this;

    var isGroup = !(!grp || !grp.length),
        inputs = isGroup ? this._inputsForGroups(grp) : Object.keys(this._inputs);

    isGroup ? this._removeError(inputs) : this._errors = {};

    return Promise.all(inputs.map(function (key) {
      return _this._validateField(key, args);
    })).then(function () {
      return _this._emit();
    });
  },

  validateField: function (name, args) {
    var _this = this;

    var fields = [].concat(name).map(function (key) {
      return _this._validateField(key, args);
    });

    this._removeError(name);

    return Promise.all(fields).then(function () {
      return _this._emit();
    });
  },

  _validateField: function (name, args) {
    var _this = this;

    var input = this._inputs[name];

    return new Promise(function (resolve, reject) {
      Promise.resolve(_this.props.validate(name, input, args)).then(function (msgs) {
        msgs = msgs == null ? [] : [].concat(msgs);
        if (msgs.length) _this._addError(name, msgs);
        resolve(!msgs.length);
      }).catch(reject);
    });
  },

  _addError: function (name, msgs) {
    this._errors[name] = msgs;
  },

  _removeError: function (fields) {
    var _this = this;

    [].concat(fields).forEach(function (field) {
      return delete _this._errors[field];
    });
  },

  _inputsForGroups: function (grps) {
    var _this = this;

    return uniq([].concat(grps).reduce(function (g, grp) {
      return g.concat(_this._groups[grp]);
    }, []));
  }

});

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