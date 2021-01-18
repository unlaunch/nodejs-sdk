import { convertToString, startsWith, endsWith } from "../../../src/utils/lang/index.js";

export default function stringApply(val, userVal, op) {
    let v = val
    let uv = convertToString(userVal);
    
    if(!uv){
        console.log('Attribute is not a valid string')
        return false;
    }

    if (op == "EQ") {
        console.log('EQ')
        return v == userVal
    } else if (op == "NEQ") {
        return v != userVal
    } else if (op == "SW") {
        return startsWith(v, uv)
    } else if (op == "NSW") {
        return !startsWith(v, uv)
    } else if (op == "EW") {
        return endsWith(v, uv, true)
    } else if (op == "NEW") {
        return !endsWith(v, uv, true)
    } else if (op == "CON") {
        return v.includes(uv)
    } else if (op == "NCON") {
        return !v.includes(uv)
    }

    // Todo log invalid op warning
    return false
}
