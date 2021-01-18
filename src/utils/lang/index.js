import { isNumber } from "util";


/**
 * Converts a value to string representation
 */
export function convertToString(val) {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val.map(val => isNumber(val) ? val : '') + '';
}

/**
 * Converts a value into a number
 */
export function convertToNumber(val) {
  if (typeof val === 'number') return val;

  if (isObject(val) && typeof val.valueOf === 'function') {
    const valOf = val.valueOf();
    val = isObject(valOf) ? valOf + '' : valOf;
  }

  if (typeof val !== 'string') {
    return val === 0 ? val : +val;
  }

  // Remove trailing whitespaces.
  val = val.replace(/^\s+|\s+$/g, '');

  return +val;
}

/**
 * Checks if the string starts with the sub string.
 */
export function startsWith(value, subStr) {
  if (!(isString(value) && isString(subStr))) {
    return false;
  }
  return value.slice(0, subStr.length) === subStr;
}

/**
 * Checks if the string ends with the sub string.
 */
export function endsWith(value, subStr, caseInsensitive = false) {
  if (!(isString(value) && isString(subStr))) {
    return false;
  }
  if (caseInsensitive) {
    value = value.toLowerCase();
    subStr = subStr.toLowerCase();
  }
  return value.slice(value.length - subStr.length) === subStr;
}


/**
 * Checks if a given value is a string.
 */
export function isString(val) {
  return typeof val === 'string' || val instanceof String;
}

/**
 * Validates if a value is an object.
 */

export function isObject(obj) {
  return obj && typeof obj === 'object' && Object.keys(obj).length !== 0 && obj.constructor === Object;
}

/**
 * Overwriting default with custom configuration
 * Validation: Parameters should always be correct (at least have a target and a source, of type object).
 */

export function merge(source, custom) {
  let res = {};
 
  isObject(source) && Object.keys(source).forEach(key => {
    let val = source[key];
    if(custom[key] && isObject(custom[key])){
      Object.keys(custom[key]).forEach(customkey =>{
        source[key][customkey] = custom[key][customkey];
      })
    }
  
  });

  return source;
}
