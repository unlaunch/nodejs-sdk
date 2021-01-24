import Store from '../utils/store/index.js';
import EventEmitter from 'events';
//processors
import PollingProcessor from "../processor/pollingProcessor.js";
import OfflineProcessor from "../processor/offlineProcessor.js";
import EventProcessor from "../events/eventProcessor.js";
import OfflineEventProcessor from "../events/offlineEventProcessor.js";
//cache
import EventsCache from "../storage/eventsCache/InMemory.js";
import CountCache from "../storage/countCache/InMemory.js";
//engine
import { evaluate } from '../engine/evaluator.js';
//utils
import { isObject } from "../../src/utils/lang/index.js";
//dtos
import Event from "../dtos/Events.js";
import Impression from "../dtos/Impression.js";
//constants
import { READY } from '../utils/store/constants.js';

/**
 * Unlaunch Client 
**/
export function ulClient(configs, store) {

    const newUnlaunchClient = function () {
        const client = new EventEmitter();
        const offlineMode = configs.mode.offlineMode;
        const processor = offlineMode ? OfflineProcessor() : PollingProcessor(configs, store);
        const eventProcessor = offlineMode ? OfflineEventProcessor() : EventProcessor(configs, store);
        const eventsCache = new EventsCache(store);
        const countCache = new CountCache(store);

        processor
            .start((err, res) => {
                store.set(READY,true);
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
            const isReady = store.get(READY);

            if (flagKey == undefined || flagKey.length < 0) {
                configs.logger.error('Please provide valid flagKey');
                return "control";
            }

            if (identity == undefined || identity.length < 0) {
                configs.logger.error('Please provide valid identity')
                return "control";
            }

            if (!attributes) {
                configs.logger.error('Please provide valid attributes')
                return "control";
            }

            if (offlineMode) {
                configs.logger.info('Offline mode selected - Control served')
                return "control";
            }

            if (!isReady) {
                configs.logger.warn("The SDK is not ready. Returning the SDK default 'control' "+
                            "as variation which may not give " +
                            "the right result");
                return "control";
            }

            const flag = store.getFeature(flagKey);

            if (Object.keys(flag).length > 0 && flag.constructor === Object) {
                const ulFeature = evaluate(flag, identity, attributes, configs.logger);
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

                configs.logger.info(`Flag evaluation reason: ${ulFeature.evaluationReason}`);

                return ulFeature.variation;
            } else {
                configs.logger.error(`Error - Flag- ${flagKey} not found`);
                return "control";
            }
        }

        /**
        * Shutdown to flush events if any and to stop processors
        **/

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