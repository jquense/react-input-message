'use strict';

var _ = 

  module.exports = {

    has: has,
    
    merge:  require('xtend'),

    extend: require('xtend/mutable'),

    transform: function(obj, cb, seed){
      _.each(obj, cb.bind(null, seed = seed || (Array.isArray(obj) ? [] : {})))
      return seed
    },

    each: function(obj, cb, thisArg){
      if( Array.isArray(obj)) return obj.forEach(cb, thisArg)

      for(var key in obj) if(has(obj, key)) 
        cb.call(thisArg, obj[key], key, obj)
    },

    pick: function(obj, keys){
      keys = [].concat(keys);
      return _.transform(obj, function(mapped, val, key){
        if( keys.indexOf(key) !== -1) mapped[key] = val
      }, {})
    },

    omit: function(obj, keys){
      keys = [].concat(keys);
      return _.transform(obj, function(mapped, val, key){
        if( keys.indexOf(key) === -1) mapped[key] = val
      }, {})
    },

  }

function has(o, k){
  return o ? Object.prototype.hasOwnProperty.call(o, k) : false
}