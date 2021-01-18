import stringApply from "../../src/engine/attributes/string.js";
import numberApply from "../../src/engine/attributes/number.js";
import boolApply from "../../src/engine/attributes/bool.js";
import dateOrDateTimeApply from "../../src/engine/attributes/datetime.js";
import setApply from "../../src/engine/attributes/set.js";

export function apply(attrType , val , userVal , op ) {

	switch(attrType) {
	case "boolean":
		return boolApply(val, userVal, op)
	case "string":
		return stringApply(val, userVal, op)
	case "number":
		return numberApply(val, userVal, op)
	case "date":
		return dateOrDateTimeApply(val, userVal, op, true)
	case "datetime":
		return dateOrDateTimeApply(val, userVal, op, false)
	case "set":
		return setApply(val, userVal, op)
	default:
		// todo log "invalid condition type"
		return false
	}
}
