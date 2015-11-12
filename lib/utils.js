'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.makeString = makeString;
exports.setPath = setPath;
exports.pushPath = pushPath;
exports.getPath = getPath;
exports.defaults = defaults;
exports.extend = extend;
exports.deepExtend = deepExtend;
exports.regexEscape = regexEscape;
exports.escape = escape;

function makeString(object) {
  if (object == null) return '';
  return '' + object;
}

function setPath(object, path, newValue) {
  var stack = undefined;
  if (typeof path !== 'string') stack = [].concat(path);
  if (typeof path === 'string') stack = path.split('.');

  while (stack.length > 1) {
    var _key = stack.shift();
    if (_key.indexOf('###') > -1) _key = _key.replace(/###/g, '.');
    if (!object[_key]) object[_key] = {};
    object = object[_key];
  }

  var key = stack.shift();
  if (key.indexOf('###') > -1) key = key.replace(/###/g, '.');
  object[key] = newValue;
}

function pushPath(object, path, newValue, concat) {
  var stack = undefined;
  if (typeof path !== 'string') stack = [].concat(path);
  if (typeof path === 'string') stack = path.split('.');

  while (stack.length > 1) {
    var _key2 = stack.shift();
    if (_key2.indexOf('###') > -1) _key2 = _key2.replace(/###/g, '.');
    if (!object[_key2]) object[_key2] = {};
    object = object[_key2];
  }

  var key = stack.shift();
  if (key.indexOf('###') > -1) key = key.replace(/###/g, '.');
  object[key] = object[key] || [];
  if (concat) object[key] = object[key].concat(newValue);
  if (!concat) object[key].push(newValue);
}

function getPath(object, path) {
  var stack = undefined;
  if (typeof path !== 'string') stack = [].concat(path);
  if (typeof path === 'string') stack = path.split('.');

  while (stack.length > 1) {
    var key = stack.shift();
    if (key.indexOf('###') > -1) key = key.replace(/###/g, '.');
    if (!object[key]) return undefined;
    object = object[key];
  }

  return object[stack.shift().replace(/###/g, '.')];
}

var arr = [];
var each = arr.forEach;
var slice = arr.slice;

function defaults(obj) {
  each.call(slice.call(arguments, 1), function (source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === undefined) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

function extend(obj) {
  each.call(slice.call(arguments, 1), function (source) {
    if (source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

function deepExtend(target, source, overwrite) {
  for (var prop in source) {
    if (prop in target) {
      // If we reached a leaf string in target or source then replace with source or skip depending on the 'overwrite' switch
      if (typeof target[prop] === 'string' || target[prop] instanceof String || typeof source[prop] === 'string' || source[prop] instanceof String) {
        if (overwrite) target[prop] = source[prop];
      } else {
        deepExtend(target[prop], source[prop], overwrite);
      }
    } else {
      target[prop] = source[prop];
    }
  }return target;
}

function regexEscape(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

/* eslint-disable */
var _entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};
/* eslint-enable */

function escape(data) {
  if (typeof data === 'string') {
    return data.replace(/[&<>"'\/]/g, function (s) {
      return _entityMap[s];
    });
  } else {
    return data;
  }
}