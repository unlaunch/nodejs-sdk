import EventEmitter from 'events';
import PollingProcessor from "../processor/pollingProcessor.js";
import OfflineProcessor from "../processor/offlineProcessor.js";
import EventProcessor from "../events/eventProcessor.js";
import OfflineEventProcessor from "../events/offlineEventProcessor.js";
import EventsCache from "../storage/eventsCache/InMemory.js";
import CountCache from "../storage/countCache/InMemory.js";
import { evaluate } from '../engine/evaluator.js';
import { isObject } from "../../src/utils/lang/index.js";
import UlFeature from "../dtos/UlFeature.js";
import Impression from "../dtos/Impression.js";
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
                store.set(READY, true);
                client.emit('READY')
                if (err) {
                    return new UlFeature(
                        "control",
                        "Sdk was not ready - control served",
                        ""
                    )
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
            return evaluateFlag(flagKey, identity, attributes).variationKey;
        }


        /**
         * Feature method to get feature object containing evaluation reason and variation
         * @param {string} flagKey 
         * @param {string} identity 
         * @param {object} attributes 
         */

        client.feature = (flagKey, identity, attributes = {}) => {
            return evaluateFlag(flagKey, identity, attributes);
        }


        /**
         *  Evaluate flag and emit metrics
         */
        const evaluateFlag = (flagKey, identity, attributes) => {
            const isReady = store.get(READY);

            if (flagKey == undefined || flagKey.length <= 0) {
                configs.logger.error('Please provide valid flagKey');
                return new UlFeature(
                    "control",
                    "Feature flag key was empty",
                    flagKey
                )
            }

            if (identity == undefined || identity.length <= 0) {
                configs.logger.error('Please provide valid identity')
                return new UlFeature(
                    "control",
                    "Identity was empty",
                    flagKey
                )
            }

            if (attributes && Object.keys(attributes).length > 0 && !isObject(attributes)) {
                configs.logger.error('Please provide valid Unlaunch attributes')
                return new UlFeature(
                    "control",
                    "Invalid Unlaunch attribute(s)",
                    flagKey
                )
            }

            if (offlineMode) {
                configs.logger.info('Offline mode selected - control served')
                return new UlFeature(
                    "control",
                    "Offline mode selected - control served",
                    flagKey
                )
            }

            if (!isReady) {
                configs.logger.warn("The SDK is not ready. Returning the SDK default 'control' " +
                    "as variation which may not give " +
                    "the right result");
                return new UlFeature(
                    "control",
                    "Sdk was not ready - control served",
                    flagKey
                )
            }

            const flag = store.getFeature(flagKey);

            if (Object.keys(flag).length > 0 && flag.constructor === Object) {
                const ulFeature = evaluate(flag, identity, attributes, configs.logger);
                if (ulFeature.variationKey != '' && ulFeature.variationKey != 'control') {
                    // record count
                    countCache.trackCount(flagKey, ulFeature.variationKey)
                    // record event
                    let event = new Impression(
                        new Date().getTime(),
                        "IMPRESSION",
                        null,
                        "Node",
                        "0.0.5",
                        null,
                        flagKey,
                        identity,
                        ulFeature.variationKey,
                        'ACTIVE',
                        ulFeature.evaluationReason,
                        "UNKNOWN",
                        "UNKNOWN"
                    )
                    eventsCache.track(event)
                }

                return ulFeature;
            } else {
                configs.logger.error(`Error flag with flagKey ${flagKey} not found`);
                return new UlFeature(
                    "control",
                    "Feature flag was not found in memory",
                    flagKey
                )
            }
        }

        /**
        * Shutdown to flush events if any and to stop processors
        **/

        client.shutdown = () => {
            eventProcessor.close()
            processor.close()
        }

        return client;

    }

    return {
        client: newUnlaunchClient
    }
}