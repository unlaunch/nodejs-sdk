import UnlaunchFeature from "../../src/dtos/UlFeature.js";
import { apply } from "../../src/engine/targeting.js";
import mmh3 from 'murmurhash3';

export function evaluate(flag, identity, attributes = {}, logger) {
    let result = new UnlaunchFeature();
    result.flagKey = flag.key;
    result.variationKey = 'control';
    result.evaluationReason = "Evaluation is not yet complete";
    result.configs = {};

    if (flag.state !== "ACTIVE") {
        result.evaluationReason = "Flag disabled. Default variation served."
        const variation = getOffVariation(flag, logger);
        result.variationKey = variation.key;
        result.configs = variation.configs;

        return result;
    } else {
        let variation = variationIfUserInAllowList(flag, identity);
        if (variation != null) {
            result.variationKey = variation.key;
            result.evaluationReason = "User is in Target Users List."
            result.configs = variation.configs;

            return result;
        } else {
            let {variation,priority} = matchTargetingRules(flag, identity, attributes);
            if (variation != null) {
                result.evaluationReason = `Target Rule with priority ${priority} matched.`
                result.variationKey = variation.key;
                result.configs = variation.configs;

                return result;
            } else {
                variation = getDefaultRule(flag, identity)
                if (variation != null) {
                    result.evaluationReason = "Default Rule served."
                    result.variationKey = variation.key
                    result.configs = variation.configs;

                    return result;
                } else {
                    result.evaluationReason = "Error evaluating SDK."
                    result.variationKey = 'control'
                    return result;
                }
            }
        }
    }
}

function getOffVariation(flag, logger) {
    const index = flag.variations.findIndex(v => v.id == flag.offVariation);
    if (index >= 0) {
        return flag.variations[index];
    } else {
        logger.info('OffVariation not found');
    }
}

const getDefaultRule = (flag, identity) => {
    const index = flag.rules.findIndex(r => r.isDefault == true);
    return getRuleVariation(flag, flag.rules[index].splits, identity)
}

function variationIfUserInAllowList(flag, identity) {
    let variation = null;
    flag.variations.map((v) => {
        if (v.allowList && v.allowList.length > 0) {
            const allowListArr = v.allowList.split(',');
            allowListArr.map((a, i) => {
                if (identity == a) {
                    variation = v;
                    return;
                }
            })
        }
    })

    return variation;
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
                matched = apply(c.type, c.value, attributes[c.attribute], c.op)
                priority = matched ? rule.priority : null;
                if (!matched) {
                    return;
                }
            } else {
                matched = false;
                return
            }
        })
        if (matched) {
             variation =  getRuleVariation(flag, rule.splits, identity);
        }
    })

    return {variation, priority};
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
        //murmur hash 
        const calculatedBucket = bucket(flag.Key + identity)
        const variationId = getVariationIdBySplit(splits, calculatedBucket)
        if (variationId != null) {
            return getVariationById(flag, variationId)
        }

        return null;
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

    if (index >= 0) {
        return splits[index].variationId
    }

    return null;
}


function getVariationById(flag, variationId) {
    const index = flag.variations.findIndex(v => v.id == variationId);
    if (index >= 0) {
        return flag.variations[index];
    }

    return null;
}

