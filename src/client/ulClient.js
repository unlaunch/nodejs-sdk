import Store from '../utils/store/index.js';
import EventEmitter from 'events';
import { UlProcessor } from "../processor/ulProcessor.js";
import { evaluate } from '../engine/evaluator.js';

export function ulClient(config, store) {

    const newUnlaunchClient = function () {
        const client = new EventEmitter();
        const processor = UlProcessor(config, store);
        processor
            .start((err, res) => {
                client.emit('READY')
                if(err){
                    return "control";
                }
            })
        /**
         * Variation method to get variation after performing evaluation 
         * @param {string} flagKey 
         * @param {string} identity 
         * @param {object} attributes 
         */
        client.variation = (flagKey, identity, attributes = {}) => {
            if (flagKey == undefined || flagKey.length < 0) {
                console.error('Please provide valid flagKey');
                return "control";
            }

            if (identity == undefined || identity.length < 0) {
                console.error('Please provide valid identity')
                return "control";
            }
            
            const flag = store.getFeature(flagKey);
       
            if (Object.keys(flag).length > 0 && flag.constructor === Object) {
              const ulFeature =  evaluate(flag, identity, attributes);
              console.log("Flag evaluation reason: ", ulFeature.evaluationReason);
              return ulFeature.variation;
            } else {
                console.log(`Error - Flag- ${flagKey} not found`);
                return "control";
            }
        }

        return client;

    }
    return {
        client: newUnlaunchClient
    }
}