export default function numberApply(val, userVal, op) {

    if (userVal === undefined || userVal === null || userVal.constructor.name != "Number") {
        throw new Error("Invalid number attribute.")
    }

    let v = parseFloat(val)
    let uv = parseFloat(userVal)

    if(!v || !uv) {
        return false
    }

    switch (op) {
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