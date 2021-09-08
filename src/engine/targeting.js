const stringApply = require("../../src/engine/attributes/string.js")
const numberApply = require("../../src/engine/attributes/number.js")
const boolApply = require("../../src/engine/attributes/bool.js")
const dateOrDateTimeApply = require("../../src/engine/attributes/datetime.js")
const setApply = require("../../src/engine/attributes/set.js")

const apply = (attrType, val, userVal, op) => {

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
		return false
	}
}
