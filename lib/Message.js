'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var React = require('react'),
    cn = require('classnames'),
    connectToMessageContainer = require('./connectToMessageContainer');

var values = function values(obj) {
  return Object.keys(obj).map(function (k) {
    return obj[k];
  });
};
var flatten = function flatten(arr, next) {
  return arr.concat(next);
};

var Message = (function (_React$Component) {
  function Message() {
    babelHelpers.classCallCheck(this, Message);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  babelHelpers.inherits(Message, _React$Component);

  Message.prototype.render = function render() {
    var _props = this.props;
    var Component = _props.component;
    var messages = _props.messages;
    var active = _props.active;
    var delim = _props.delim;
    var fieldFor = _props['for'];
    var props = babelHelpers.objectWithoutProperties(_props, ['component', 'messages', 'active', 'delim', 'for']);

    if (!active) return null;

    return React.createElement(
      Component,
      props,
      values(messages).reduce(flatten, []).join(delim)
    );
  };

  babelHelpers.createClass(Message, null, [{
    key: 'defaultProps',
    value: {
      component: 'span',
      delim: ', '
    },
    enumerable: true
  }]);
  return Message;
})(React.Component);

module.exports = connectToMessageContainer(Message);
module.exports._Message = Message;