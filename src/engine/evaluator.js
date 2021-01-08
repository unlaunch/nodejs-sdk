import UnlaunchFeature from "../../src/dtos/ulFeature.js";


export function evaluate(flag, identity, attributes = {}) {
    let result = new UnlaunchFeature();
    result.feature = flag.key
    result.evaluationReason = "Evaluation is not yet complete"

    if (flag.state !== "ACTIVE") {
        result.evaluationReason = "Flag disabled. Default Variation served"
        const offVariation = getOffVariation(flag)
        result.variation = offVariation
        return result;
    } else {
        const variation = variationIfUserInAllowList(flag, identity);
        if (variation != null) {
            result.variation = variation
            result.evaluationReason = "User is in Target Users List"
            return result;
        } else {
            // offvariation is returned for time being 
            result.evaluationReason = "Flag disabled. Default Variation served"
            const offVariation = getOffVariation(flag)
            result.variation = offVariation
            return result;
        }
    }
}

function getOffVariation(flag) {
    let offVarId = flag.offVariation;
    const index = flag.variations.findIndex(v => v.id == offVarId);

    if (index >= 0) {
        return flag.variations[index].key;
    } else {
        console.log('OffVariation not found');
    }
}

function variationIfUserInAllowList(flag, identity) {
    
    let isPresent = false;
    let variation = null;

    flag.variations.map((v) => {

        if (v.allowList && v.allowList.length > 0) {

            const allowListArr = v.allowList.split(',');
            allowListArr.map((a, i) => {
                if (identity == a) {
                    isPresent = true;
                    variation = v;
                    return
                }
            })
        }
        if (isPresent || !v.allowList) {
            return;
        }
    })
    return variation.key;
}


