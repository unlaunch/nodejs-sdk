import "../../../src/engine/helper/setMatcher.js";
import { convertToString } from "../../../src/utils/lang/index.js";

export default function setApply(val, userVal, op){

	let vals = convertToString(val)
	const ruleSet = new Set();
	vals.split(",").map((item)=>{
		ruleSet.add(item.trim())
	}) 

	let uValues = convertToString(userVal)
	let userValuesSet = new Set()
	uValues.split(",").map((item)=>{	
		userValuesSet.add(item.trim())
	})
	
	let i;
    
	switch(op){
	case "AO": // All Of
		return userValuesSet.isSuperSet(ruleSet)
	case "NAO":
		return !userValuesSet.isSuperSet(ruleSet)
	case "HA": // Has Any Of
		i = userValuesSet.intersect(ruleSet)
		return i.cardinality() > 0
	case "NHA": // Not Has Any Of
		i = userValuesSet.intersect(ruleSet)
		return i.cardinality() == 0
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
