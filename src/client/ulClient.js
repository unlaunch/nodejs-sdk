const EventEmitter = require('events')
const PollingProcessor = require("../processor/pollingProcessor.js")
const OfflineProcessor = require("../processor/offlineProcessor.js")
const EventProcessor = require("../events/eventProcessor.js")
const OfflineEventProcessor = require("../events/offlineEventProcessor.js")
const EventsCache = require("../storage/eventsCache/InMemory.js")
const CountCache = require("../storage/countCache/InMemory.js")
const { evaluate } = require('../engine/evaluator.js')
const { isObject } = require("../../src/utils/lang/index.js")
const UlFeature = require("../dtos/UlFeature.js")
const Impression = require("../dtos/Impression.js")
const { READY } = require('../utils/store/constants.js')

/**
 * Unlaunch Client 
**/
const ulClient = (configs, store) => {

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
         * Get configuration (key-value properties) attached to variation
         * @param {string} flagKey
         * @param {string} identity
         * @param {object} attributes
         */
        client.variationConfiguration = (flagKey, identity, attributes = {}) => {
            return evaluateFlag(flagKey, identity, attributes).configs;
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
                configs.logger.error('error: [Unlaunch] Please provide valid flagKey');
                return new UlFeature(
                    "control",
                    "Feature flag key was empty",
                    flagKey
                )
            }

            if (identity == undefined || identity.length <= 0) {
                configs.logger.error('error: [Unlaunch] Please provide valid identity')
                return new UlFeature(
                    "control",
                    "Identity was empty",
                    flagKey
                )
            }

            if (attributes && Object.keys(attributes).length > 0 && !isObject(attributes)) {
                configs.logger.error('error: [Unlaunch] Please provide valid Unlaunch attributes')
                return new UlFeature(
                    "control",
                    "Invalid Unlaunch attribute(s)",
                    flagKey
                )
            }

            if (offlineMode) {
                configs.logger.info('info: [Unlaunch] Offline mode selected - control served')
                return new UlFeature(
                    "control",
                    "Offline mode selected - control served",
                    flagKey
                )
            }

            if (!isReady) {
                configs.logger.warn("warn: [Unlaunch] The SDK is not ready. Returning the SDK default 'control' " +
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
                configs.logger.error(`error: [Unlaunch] Error flag with flagKey ${flagKey} not found`);
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
module.exports = {ulClient}