import { CONFIGURATIONS, EVENTS,EVENTS_COUNT } from '../../utils/store/constants.js';

class CountCache {

    constructor(store) {
        this.store = store;
        const settings = store.get(CONFIGURATIONS);
        this.maxQueue = settings.size.metricsQueueSize;

        const eventsCount = store.get(EVENTS_COUNT);
        if (eventsCount && eventsCount.length > 0) {
            this.queue = eventsCount;
            this.queueSize = eventsCount.length;
        } else {
            this.queue = [];
            this.queueSize = 0;
        }
    }

    /**
     * Get the current state of the queue.
     */
    state() {
        return this.queue;
    }

    /**
     * Increment count when a new event object at the end of the queue.
     */
    trackCount(flagKey, variationKey) {
        
        if (flagKey == "" || variationKey == "") {
            return false
        }

        let count = 0;
        let eventsCount = this.store.get(EVENTS_COUNT);

        if (eventsCount) {
            const index = eventsCount.findIndex(e => e.key == `${flagKey},${variationKey}`);

            const eventsCountObj = {
                key: `${flagKey},${variationKey}`,
                count: index >= 0 ? eventsCount[index].count + 1 : count++
            }
            if (index >= 0) {
                eventsCount[index] = eventsCountObj
            } else {
                eventsCount.push(eventsCountObj)
            }
        } else {
            eventsCount = [];
            const eventsCountObj = {
                key: `${flagKey},${variationKey}`,
                count: 1
            }
            eventsCount.push(eventsCountObj)
        }

        this.store.set(EVENTS_COUNT, eventsCount)

        return true;
    }
}

export default CountCache;