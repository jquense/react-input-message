'use strict';

exports.__esModule = true;

function isEql(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a)) return !a.some(function (a, idx) {
    return a !== b[idx];
  });

  return false;
}

function shallowEqual(objA, objB) {
  var eql = arguments.length <= 2 || arguments[2] === undefined ? isEql : arguments[2];

  if (objA === objB) return true;

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || !eql(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

exports['default'] = shallowEqual;
module.exports = exports['default'];