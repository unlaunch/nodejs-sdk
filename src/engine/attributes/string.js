export default function stringApply(val, userVal, op) {

    if (userVal === undefined || userVal === null || userVal.constructor.name != "String") {
        throw new Error("Invalid string attribute.")
    }

    let v = val
    let uv = userVal;
    
    if(!uv){
        return false;
    }

    if (op == "EQ") {
        return uv == v 
    } else if (op == "NEQ") {
        return uv != v
    } else if (op == "SW") {
        return uv.startsWith(v);
    } else if (op == "NSW") {
        return !uv.startsWith(v);
    } else if (op == "EW") {
        return uv.endsWith(v);
    } else if (op == "NEW") {
        return !uv.endsWith(v);
    } else if (op == "CON") {
        return uv.includes(v)
    } else if (op == "NCON") {
        return !uv.includes(v)
    }

    return false
}
