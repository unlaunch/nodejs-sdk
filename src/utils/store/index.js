import objectAssign from 'object-assign'
import logger from "../logger/logger.js";


class Store {
  constructor() {
    this._unlaunchMap = {};
  }
  // set key value in map
  set(key, value) {
    if (typeof key !== 'string' || (typeof key === 'string' && !key.length) || key === undefined) return false; // We can't store this.
    this._unlaunchMap[key] = value;
    return true;
  }

  setFeatures(value) {
    this._unlaunchMap['features'] = value;
  }

  //get a particular key from context
  get(key) {
    if (typeof key !== 'string' || typeof key === 'string' && !key.length) return null;
    const value = this._unlaunchMap[key];
    if (value !== undefined) {
      return value;
    }
    return null;
  }

  getFeature(key) {
    const flags = this.get('features');
    if (flags && Object.keys(flags).length > 0) {
      const index = flags ? flags.findIndex((flag) => flag.key == key) : '-1';
      if (index >= 0) {
        return (flags[index])
      }
    }

    return {};
  }

  // get all items stored in context
  getAll() { return objectAssign({}, this._unlaunchMap); }

  newFeatureStore(config) {
    return {
      config: config,
      getFeatures: this.get('features')
    }
  }
}

export default Store;
