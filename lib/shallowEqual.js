'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function isEql(a, b) {
  if (a === b) return true;
  if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== (typeof b === 'undefined' ? 'undefined' : _typeof(b))) return false;

  if (Array.isArray(a)) return !a.some(function (a, idx) {
    return a !== b[idx];
  });

  return false;
}

function shallowEqual(objA, objB) {
  var eql = arguments.length <= 2 || arguments[2] === undefined ? isEql : arguments[2];

  if (objA === objB) return true;

  if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  for (var i = 0; i < keysA.length; i++) {
    var key = keysA[i];
    if (!bHasOwnProperty(key)) return false;
    if (!eql(objA[key], objB[key])) return false;
  }

  return true;
}

exports.default = shallowEqual;
module.exports = exports['default'];