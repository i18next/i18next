export function makeString(object) {
  if (object == null) return '';
  return '' + object;
}

export function setPath(object, path, newValue) {
  let stack;
  if (typeof path !== 'string') stack = [].concat(path);
  if (typeof path === 'string') stack = path.split('.');

  while(stack.length > 1) {
    let key = stack.shift();
    if (key.indexOf('###') > -1) key = key.replace(/###/g, '.');
    if (!object[key]) object[key] = {};
    object = object[key];
  }

  let key = stack.shift();
  if (key.indexOf('###') > -1) key = key.replace(/###/g, '.');
  object[key] = newValue;
}

export function pushPath(object, path, newValue, concat) {
  let stack;
  if (typeof path !== 'string') stack = [].concat(path);
  if (typeof path === 'string') stack = path.split('.');

  while(stack.length > 1) {
    let key = stack.shift();
    if (key.indexOf('###') > -1) key = key.replace(/###/g, '.');
    if (!object[key]) object[key] = {};
    object = object[key];
  }

  let key = stack.shift();
  if (key.indexOf('###') > -1) key = key.replace(/###/g, '.');
  object[key] = object[key] || [];
  if (concat) object[key] = object[key].concat(newValue);
  if (!concat) object[key].push(newValue);
}

export function getPath(object, path) {
  let stack;
  if (typeof path !== 'string') stack = [].concat(path);
  if (typeof path === 'string') stack = path.split('.');

  while(stack.length>1) {
    let key = stack.shift();
    if (key.indexOf('###') > -1) key = key.replace(/###/g, '.');
    if (!object[key]) return undefined;
    object = object[key];
  }

  return object[stack.shift().replace(/###/g, '.')];
}

let arr = [];
let each = arr.forEach;
let slice = arr.slice;
export function defaults(obj) {
  each.call(slice.call(arguments, 1), function(source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === undefined) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

export function extend(obj) {
  each.call(slice.call(arguments, 1), function(source) {
    if (source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

export function deepExtend(target, source, overwrite) {
  for (let prop in source)
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
  return target;
}

export function regexEscape(str) {
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

export function escape(data) {
  if (typeof data === 'string') {
    return data.replace(/[&<>"'\/]/g, function (s) {
      return _entityMap[s];
    });
  } else {
    return data;
  }
}
