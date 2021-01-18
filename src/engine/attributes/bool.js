

export default function boolApply(val, userVal , op ){
	const v =  Boolean(val)
	const uv = Boolean(userVal)


	if(op == "EQ"){
		return uv == v
	} else if(op == "NEQ"){
		return uv != v
	}

    // Todo log invalid op warning; flag json broken
	return false
}