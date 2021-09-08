
 Set.prototype.equals= (target) => {
  
    // Length being the same is the first condition.
    let isEqual = this.size === target.size;

    for (let i = 0; i < target.length && isEqual; i++) {
        // if length is the same we check that all elements are present in the other set
        if (this.findIndex(item => item == target[i]) < 0) {
            isEqual = false;
        }
    }

    return isEqual;
};

Set.prototype.isSubSet = (target) => {
    // if size of this set is greater 
    // than target then it can't be  
    // a subset 
  
    if (this.size > target.size)
        return false;
    else {
        for (var item of this) {
            // if any of the element of  
            // this is not present in the 
            // otherset then return false 
            if (!target.has(item))
                return false;
        }
        return true;
    }
}

Set.prototype.isSuperSet = (target) => {
    // if size of this set is less 
    // than target then it can't be  
    //  a superset 
    if (this.size < target.size)
        return false;
    else {
        for (var item of target) {
            // if any of the element of  
            // this is not present in the 
            // other set then return false 
            if (!this.has(item))
                return false;
        }
        return true;
    } 
}

Set.prototype.intersect= (target) => {
    // creating new set to store intersection 
    var intersectionSet = new Set();

    // Iterate over the values  
    for (var elem of target) {
        // if the other set contains a  
        // similar value as of value[i] 
        // then add it to intersectionSet 
        if (this.has(elem))
            intersectionSet.add(elem);
    }

    // return values of intersectionSet 
    return intersectionSet;
}

Set.prototype.cardinality= ()  => {
  return this.size;
}