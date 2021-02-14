import "../../../src/engine/helper/setMatcher.js";

export default function setApply(val, userVal, op){

	if (userVal === undefined || userVal === null) {
		throw new Error("Invalid set attribute value. Set attribute must be type of set or array.")
	}

	let userValuesSet;
	if (Array.isArray(userVal)) {
		userValuesSet = new Set(userVal);
	} else if (userVal.constructor.name == "Set") {
		userValuesSet = userVal;
	} else {
		throw new Error("Invalid set attribute value. Set attribute must be type of set or array.")
	}

	let ruleSet = new Set()
	val.split(",").map((item)=>{
		ruleSet.add(item.trim())
	})
    
	switch(op){
	case "AO": // All Of
		return userValuesSet.isSuperSet(ruleSet)
	case "NAO":
		return !userValuesSet.isSuperSet(ruleSet)
	case "HA": // Has Any Of
		return userValuesSet.intersect(ruleSet).cardinality() > 0
	case "NHA": // Not Has Any Of
		return userValuesSet.intersect(ruleSet).cardinality() == 0
	case "EQ": // Equals
		return userValuesSet.equals(ruleSet)
	case "NEQ": // Not Equals
		return !userValuesSet.equals(ruleSet)
	case "PO": // Part Of
		if(userValuesSet.cardinality() < 1){
			return false
		}
		return userValuesSet.isSubSet(ruleSet)
	case "NPO": // Not Part Of
		if(userValuesSet.cardinality() < 1){
			return false
		}
		return !userValuesSet.isSubSet(ruleSet)
	default:
		return false
	}

	return false
}
