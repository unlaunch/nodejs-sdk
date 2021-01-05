/**
 * Factory method for UnLaunch Client
 */

import { ConfigsFactory } from '../utils/settings/index.js'
import { validateApiKey } from '../utils/validations/apiKey.js';
import Store from '../utils/store/index.js';
import {CONFIGURATIONS,READY} from '../utils/store/constants.js';
import {ulClient} from '../client/ulClient.js'


export function UnlaunchFactory(configurations) {
    const store = new Store();
    const configs = ConfigsFactory(configurations);
    store.set(CONFIGURATIONS, configs);
    store.set(READY, true);

    console.log(store.getAll())
    if (!configs.core.sdkKey) {
        throw ('Factory intantiation requires a valid sdk key');
    } else {
        if (!validateApiKey(configs.core.sdkKey)) {
            throw ('Client intantiation requires a valid sdk key');
        }
    }
    return {
        client() {
            console.info('New client instance created.');
            return ulClient(configs);
        },
        logger: 'Logger' // add it later
    }
} 
