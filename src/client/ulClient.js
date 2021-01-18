import Store from '../utils/store/index.js';
import EventEmitter from 'events';
// import { UlProcessor } from "../processor/ulProcessor.js";
import PollingProcessor from "../processor/pollingProcessor.js";
import EventProcessor from "../events/eventProcessor.js";
import EventsCache from "../storage/eventsCache/InMemory.js";
import CountCache from "../storage/countCache/InMemory.js";
import { evaluate } from '../engine/evaluator.js';
import { isObject } from "../../src/utils/lang/index.js";
import Event from "../dtos/Events.js";
import Impression from "../dtos/Impression.js";

export function ulClient(config, store) {

    const newUnlaunchClient = function () {
        const client = new EventEmitter();
        const processor = PollingProcessor(config, store);
        const eventProcessor = EventProcessor(config, store);
        const eventsCache = new EventsCache(store);
        const countCache = new CountCache(store);
        processor
            .start((err, res) => {
                client.emit('READY')
                if (err) {
                    return "control";
                }
            })

        eventProcessor.start();


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

            if (attributes && !isObject(attributes)) {
                console.error('Please provide valid attributes')
                return "control";
            }

            const flag = store.getFeature(flagKey);

            if (Object.keys(flag).length > 0 && flag.constructor === Object) {
                const ulFeature = evaluate(flag, identity, attributes);
                if (ulFeature.variation != '' && ulFeature.variation != 'control') {
                    // record count
                    countCache.trackCount(flagKey, ulFeature.variation)
                    // record event
                    let event = new Impression(
                        Math.floor(new Date().getTime() / 1000) * 1000,
                        "IMPRESSION",
                        null,
                        "Node",
                        "0.0.1",
                        null,
                        flagKey,
                        identity,
                        ulFeature.variation,
                        'ACTIVE',
                        ulFeature.evaluationReason,
                        "UNKNOWN",
                        "UNKNOWN"

                    )
                    eventsCache.track(event)
                }
                console.log("Flag evaluation reason: ", ulFeature.evaluationReason);

                return ulFeature.variation;
            } else {
                console.log(`Error - Flag- ${flagKey} not found`);
                return "control";
            }
        }
        client.shutdown = () => {
            processor.close()
            eventProcessor.close()
        }

        return client;

    }
    return {
        client: newUnlaunchClient
    }
}