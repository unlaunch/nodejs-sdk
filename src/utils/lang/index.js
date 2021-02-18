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
  isObject(source) && Object.keys(source).forEach(key => {
    if(custom[key] && isObject(custom[key])){
      Object.keys(custom[key]).forEach(customkey =>{
        source[key][customkey] = custom[key][customkey];
      })
    }
  });

  return source;
}
