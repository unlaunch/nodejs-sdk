import UnlaunchFeature from "../../src/dtos/UlFeature.js";
import { apply } from "../../src/engine/targeting.js";
import { isObject } from "../../src/utils/lang/index.js";
import mmh3 from 'murmurhash3';

export function evaluate(flag, identity, attributes = {},logger) {
    let result = new UnlaunchFeature();
    result.feature = flag.key
    result.variation = 'control'
    result.evaluationReason = "Evaluation is not yet complete"

    if (flag.state !== "ACTIVE") {
        result.evaluationReason = "Flag disabled. Default Variation served."
        const offVariation = getOffVariation(flag)
        result.variation = offVariation
        return result;
    } else {
        let variation = variationIfUserInAllowList(flag, identity);
        if (variation != null) {
            result.variation = variation
            result.evaluationReason = "User is in Target Users List."
            return result;
        } else {
            let {variation,priority} = matchTargetingRules(flag, identity, attributes);
            if (variation != null) {
                result.evaluationReason = `Target Rule with priority ${priority} matched.`
                result.variation = variation
                return result;
            } else {
                variation = getDefaultRule(flag, identity)
                if (variation != null) {
                    result.evaluationReason = "Default Rule served."
                    result.variation = variation
                    return result;
                } else {
                    result.evaluationReason = "Error evaluating SDK."
                    result.variation = 'control'
                    return result;
                }
            }

        }
    }
}

function getOffVariation(flag) {
    let offVarId = flag.offVariation;
    const index = flag.variations.findIndex(v => v.id == offVarId);

    if (index >= 0) {
        return flag.variations[index].key;
    } else {
        logger.info('OffVariation not found');
    }
}

const getDefaultRule = (flag, identity) => {
    const index = flag.rules.findIndex(r => r.isDefault == true);
    const variation = getRuleVariation(flag, flag.rules[index].splits, identity)
    return variation;
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
    return variation != null ? variation.key : null;
}

const sortByProperty = (array, property) => {
    array.sort(function (a, b) {
        return a[`${property}`] - b[`${property}`];
    });
    return array;
}

function matchTargetingRules(flag, identity, attributes) {
    let variation = null;
    let priority = null;

    sortByProperty(flag.rules, 'priority').map((rule) => {
        let matched = false
        // Loop through all conditions
        rule.conditions.map((c) => {
            if (c.attribute in attributes) {
                matched = apply(c.type, c.value, attributes[c.attribute],c.op)
                priority = matched? rule.priority: null;
                if (!matched) return;
            } else {
                matched = false;
                return
            }
        })
        if (matched) {
             variation =  getRuleVariation(flag, rule.splits, identity);
        }
    })
    return {variation,priority};
}

function bucket(key) {
    const hashValue = mmh3.murmur32Sync(key);
    return (Math.abs(hashValue % 100) + 1)
}


function getRuleVariation(flag, splits, identity) {
   
    if (splits.length === 1 && splits[0].rolloutPercentage == 100) {
        // single variation selected
        return getVariationById(flag, splits[0].variationId)
    } else {
        let variation = null;
        //murmur hash 
        const calculatedBucket = bucket(flag.Key + identity)
        if (calculatedBucket) {
            const vId = getVariationIdBySplit(splits, calculatedBucket)
          
            if (vId != null) {
                variation = getVariationById(flag, vId)
            }
        } 
        return variation
    }

}

function getVariationIdBySplit(splits, bucketNum) {
    let sum = 0;
    let index = -1;
    splits = sortByProperty(splits, 'variationId');

    for (var i = 0; i < splits.length; i++) {
        sum += splits[i].rolloutPercentage;
        if (bucketNum < sum) {
            index = i;
            break;
        }
    }

    if (index >= 0) return splits[index].variationId
    logger.info("Variation By Split Not Found")
    return null;
}


function getVariationById(flag, variationId) {

    const index = flag.variations.findIndex(v => v.id == variationId);
    if (index >= 0) return flag.variations[index].key
    else return null
}

