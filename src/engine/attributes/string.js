import { convertToString, startsWith, endsWith } from "../../../src/utils/lang/index.js";

export default function stringApply(val, userVal, op) {
    let v = val
    let uv = convertToString(userVal);
    
    if(!uv){
        // logger.log('Attribute is not a valid string')
        return false;
    }

    if (op == "EQ") {
        return uv == v 
    } else if (op == "NEQ") {
        return uv != v
    } else if (op == "SW") {
        return startsWith(uv, v)
    } else if (op == "NSW") {
        return !startsWith(uv, v)
    } else if (op == "EW") {
        return endsWith(uv, v, true)
    } else if (op == "NEW") {
        return !endsWith(uv, v, true)
    } else if (op == "CON") {
        return uv.includes(v)
    } else if (op == "NCON") {
        return !uv.includes(v)
    }

    // Todo log invalid op warning
    return false
}
