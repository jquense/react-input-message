'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react'),
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
  _inherits(Message, _React$Component);

  function Message() {
    _classCallCheck(this, Message);

    _React$Component.apply(this, arguments);
  }

  Message.prototype.render = function render() {
    var _props = this.props;
    var Component = _props.component;
    var messages = _props.messages;
    var active = _props.active;
    var delim = _props.delim;
    var extract = _props.extract;
    var filter = _props.filter;
    var fieldFor = _props['for'];

    var props = _objectWithoutProperties(_props, ['component', 'messages', 'active', 'delim', 'extract', 'filter', 'for']);

    if (!active) return null;

    return React.createElement(
      Component,
      props,
      values(messages).reduce(flatten, []).filter(function (v, i, l) {
        return filter(v, i, l, extract);
      }).map(extract).join(delim)
    );
  };

  _createClass(Message, null, [{
    key: 'defaultProps',
    value: {
      component: 'span',
      delim: ', ',
      extract: function extract(f) {
        return f;
      },
      filter: function filter(f) {
        return true;
      }
    },
    enumerable: true
  }]);

  return Message;
})(React.Component);

module.exports = connectToMessageContainer(Message);
module.exports._Message = Message;