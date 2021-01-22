import "../../../src/engine/helper/setMatcher.js";
import { convertToString } from "../../../src/utils/lang/index.js";

export default function setApply(val, userVal, op, logger){

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
	case "AO": // All of
		return userValuesSet.isSuperSet(ruleSet)
	case "NAO":
		return !userValuesSet.isSuperSet(ruleSet)
	case "HA": // Has any of
		i = userValuesSet.intersect(ruleSet)
		return i.cardinality() > 0
	case "NHA": // Not Has any of
		 i = userValuesSet.intersect(ruleSet)
		return i.cardinality() == 0
	case "EQ": // Equals
		return userValuesSet.equals(ruleSet)
	case "NEQ": // Equals
		return !userValuesSet.equals(ruleSet)
	case "PO": // Part of
		if(userValuesSet.cardinality() < 1){
			return false
		}
		return userValuesSet.isSubSet(ruleSet)
	case "NPO": // Not Part of
		if(userValuesSet.cardinality() < 1){
			return false
		}
		return !userValuesSet.isSubSet(ruleSet)
	default:
		// Todo log invalid op warning
		return false
	}

	// Todo log invalid op warning
	logger.info('Invalid operator')
	return false
}
