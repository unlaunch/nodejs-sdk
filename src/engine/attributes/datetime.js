export default function dateOrDateTimeApply(val, userVal, op, discardTime){
	// This is the value in Java
	// v = strconv.ParseInt(val.(string), 10, 64)
	let v = javaTimeToEpoch(v)

	let uv = userVal

	if(discardTime){
		v = tsWithZeroTime(v)
		uv = tsWithZeroTime(uv)
	}

	if(uv == null) {
		// TODO log warning that name matches but type is not right
		return false
	}

	switch(op) {
	case "EQ":
		return uv == v
	case "GT":
		return uv > v
	case "GTE":
		return uv >= v
	case "LT":
		return uv < v
	case "LTE":
		return uv <= v
	case "NEQ":
		return uv != v
	default:
		return false
	}
}

function javaTimeToEpoch(ts){
	return ts / 1000
}

function tsWithZeroTime(ts){
    var d = new Date(ts*1000);
    d.setHours(0,0,0,0);
    return d.getUTCMilliseconds();
}