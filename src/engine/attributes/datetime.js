const dateOrDateTimeApply = (val, userVal, op, discardTime) => {
	let v = val
	let uv = userVal

	if (uv == null) {
		throw new Error("Invalid date or datetime value")
	}

	if (uv.constructor.name == "Date") {
		if (discardTime) {
			uv.setHours(0, 0, 0, 0);
			v = tsWithZeroTime(val);
		}
		uv = uv.getTime();
	} else if (uv.constructor.name == "Number") {
		if(discardTime){
			v = tsWithZeroTime(val)
			uv = tsWithZeroTime(userVal)
		}
	} else {
		throw new Error("Date or datetime must be type of Date or time value in milliseconds")
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

function tsWithZeroTime(ts){
	const d = new Date(Number(ts));
	d.setHours(0,0,0,0);
    return d.getTime();
}


module.exports = {
    default: dateOrDateTimeApply
}