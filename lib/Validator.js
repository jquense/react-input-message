'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var React = require('react'),
    ReactElement = require('react/lib/ReactElement'),
    Promise = require('promise/lib/es6-extensions');

var Validator = (function () {
  function Validator(validate) {
    babelHelpers.classCallCheck(this, Validator);

    this._validator = validate;
    this._errors = Object.create(null);
  }

  Validator.prototype.errors = function errors(names) {
    var _this = this;

    if (!names || !names.length) return babelHelpers._extends({}, this._errors);

    return [].concat(names).reduce(function (o, name) {
      if (_this._errors[name]) o[name] = _this._errors[name];

      return o;
    }, {});
  };

  Validator.prototype.isValid = function isValid(name) {
    return !this._errors[name] || !this._errors[name].length;
  };

  Validator.prototype.validate = function validate(name, context) {
    var _this2 = this;

    var fields = [].concat(name).map(function (key) {
      return _this2._validateField(key, context);
    });

    this._removeError(name);

    return Promise.all(fields);
  };

  Validator.prototype._validateField = function _validateField(name, context) {
    var _this3 = this;

    return new Promise(function (resolve, reject) {
      Promise.resolve(_this3._validator(name, context)).then(function (msgs) {
        msgs = msgs == null ? [] : [].concat(msgs);
        if (msgs.length) _this3._addError(name, msgs);
        resolve(!msgs.length);
      })['catch'](reject);
    });
  };

  Validator.prototype._addError = function _addError(name, msgs) {
    this._errors[name] = msgs;
  };

  Validator.prototype._removeError = function _removeError(fields) {
    var _this4 = this;

    [].concat(fields).forEach(function (field) {
      return delete _this4._errors[field];
    });
  };

  return Validator;
})();

module.exports = Validator;