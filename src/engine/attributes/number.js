export default function numberApply(val, userVal, op) {

    let v = parseInt(val)
    let uv= parseInt(userVal)

    if(!v || !uv) {
        // TODO log warning that name matches but type is not bool
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
            // Todo log invalid op warning
            return false

    }
ss}