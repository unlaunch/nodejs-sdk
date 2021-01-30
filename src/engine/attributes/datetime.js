export default function dateOrDateTimeApply(val, userVal, op, discardTime){
	let v = val

	let uv = userVal

	if(discardTime){
		v = tsWithZeroTime(val)
		uv = tsWithZeroTime(userVal)
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
	var d = new Date(Number(ts));
	d.setHours(0,0,0,0);
    return d.getTime();
}