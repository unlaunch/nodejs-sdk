export default function boolApply(val, userVal, op){

	if(userVal == null || userVal.constructor.name != "Boolean") {
		throw new Error("Invalid boolean attribute value");
	}

	const v =  Boolean(val)
	const uv = Boolean(userVal)

	if(op == "EQ"){
		return uv == v
	} else if(op == "NEQ"){
		return uv != v
	}

	return false
}