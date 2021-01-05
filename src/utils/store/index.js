import objectAssign from 'object-assign'

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

  //get a particular key from context
  get(key){
        if (typeof key !== 'string' || typeof key === 'string' && !key.length) return null;
	const value = this._unlaunchMap[key];
        if (value !== undefined) {
      	  return value;
    	} 		 
	return null;
  }

  // get all items stored in context
  getAll() { return objectAssign({}, this._unlaunchMap); }
  
}

export default Store;
