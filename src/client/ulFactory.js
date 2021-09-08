/**
 * Factory method for Unlaunch Client
 */

const { ConfigsFactory } = require('../utils/settings/index.js')
const { validateApiKey } = require('../utils/validations/apiKey.js')
var Store = require('../utils/store/index.js')
const { CONFIGURATIONS, READY } = require('../utils/store/constants.js')    
const { ulClient } = require('../client/ulClient.js')

const UnlaunchFactory = (configurations) => {
    const store = new Store();
    const configs = ConfigsFactory(configurations);
    store.set(CONFIGURATIONS, configs);
    store.set(READY, false);

    if (!configs.core.sdkKey) {
        throw ('error: [Unlaunch] Factory instantiation requires a valid sdk key');
    } else {
        if (!validateApiKey(configs.core.sdkKey, configs.logger)) {
            throw ('error: [Unlaunch] Client instantiation requires a valid sdk key');
        }
    }
    return {
        client() {
            configs.logger.info('info: [Unlaunch] Initializing Unlaunch client instance and receiving feature flag updates');
            configs.logger.debug(`debug: [Unlaunch] Configuration: [ \n\t`+  
                                  `sdkKey = ${configs.core.sdkKey},\n\t`+ 
                                  `pollingInterval = ${configs.intervals.pollingInterval} milliseconds,\n\t`+
                                  `httpConnectionTimeout = ${configs.intervals.httpConnectionTimeout} milliseconds,\n\t`+
                                  `metricsFlushInterval = ${configs.intervals.metricsFlushInterval} milliseconds,\n\t`+
                                  `metricsQueueSize = ${configs.size.metricsQueueSize},\n\t`+
                                  `eventsFlushInterval = ${configs.intervals.eventsFlushInterval} milliseconds,\n\t`+ 
                                  `eventsQueueSize = ${configs.size.eventsQueueSize}\n\t`+
                                  `]`)
            return ulClient(configs, store).client();
        },
    }
} 
module.exports = { UnlaunchFactory }