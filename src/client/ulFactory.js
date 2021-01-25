/**
 * Factory method for UnLaunch Client
 */

import { ConfigsFactory } from '../utils/settings/index.js'
import { validateApiKey } from '../utils/validations/apiKey.js';
import Store from '../utils/store/index.js';
import { CONFIGURATIONS, READY } from '../utils/store/constants.js';
import { ulClient } from '../client/ulClient.js'

export function UnlaunchFactory(configurations) {
    const store = new Store();
    const configs = ConfigsFactory(configurations);
    store.set(CONFIGURATIONS, configs);
    store.set(READY, false);

    if (!configs.core.sdkKey) {
        throw ('Factory intantiation requires a valid sdk key');
    } else {
        if (!validateApiKey(configs.core.sdkKey, configs.logger)) {
            throw ('Client intantiation requires a valid sdk key');
        }
    }
    return {
        client() {
            configs.logger.info('New Unlaunch client instance created.');
            configs.logger.info(`Configuration: [ \n\t`+  
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
