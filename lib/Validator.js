"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var React = require("react"),
    ReactElement = require("react/lib/ReactElement");

var Promise = require("es6-promise").Promise,
    uniq = require("array-uniq");

var Validator = (function () {
  function Validator(validate) {
    _classCallCheck(this, Validator);

    this._validator = validate;
    this._errors = Object.create(null);
  }

  Validator.prototype.errors = function errors(names) {
    var _this = this;

    if (!names || !names.length) return _extends({}, this._errors);

    return [].concat(names).reduce(function (o, name) {
      if (_this._errors[name]) o[name] = _this._errors[name];

      return o;
    }, {});
  };

  Validator.prototype.isValid = function isValid(name) {
    return !this._errors[name] || !this._errors[name].length;
  };

  Validator.prototype.validate = function validate(name, context) {
    var _this = this;

    var fields = [].concat(name).map(function (key) {
      return _this._validateField(key, context);
    });

    this._removeError(name);

    return Promise.all(fields);
  };

  Validator.prototype._validateField = function _validateField(name, context) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      Promise.resolve(_this._validator(name, context)).then(function (msgs) {
        msgs = msgs == null ? [] : [].concat(msgs);
        if (msgs.length) _this._addError(name, msgs);
        resolve(!msgs.length);
      }).catch(reject);
    });
  };

  Validator.prototype._addError = function _addError(name, msgs) {
    this._errors[name] = msgs;
  };

  Validator.prototype._removeError = function _removeError(fields) {
    var _this = this;

    [].concat(fields).forEach(function (field) {
      return delete _this._errors[field];
    });
  };

  return Validator;
})();

module.exports = Validator;