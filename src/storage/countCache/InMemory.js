import { CONFIGURATIONS, EVENTS,EVENTS_COUNT } from '../../utils/store/constants.js';
import EventProcessor from "../../events/eventProcessor.js";
import AsyncLock from 'async-lock';

// TODO: Add synchronization
const lock = new AsyncLock();

class CountCache {

    constructor(store) {
        this.store = store;
        const settings = store.get(CONFIGURATIONS);
        const eventsCount = store.get(EVENTS_COUNT);
        this.maxQueue = settings.size.metricsQueueSize;
        this.queue = [];
        this.queueSize = 0;
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

    /**
     * Clear the data stored on the cache.
     */
    clear() {
        this.queue = [];
        this.queueSize = 0;

        return this;
    }

    /**
     * Returns the payload we will use for posting data.
     */
    toJSON() {
        return this.queue;
    }

    /**
     * Check if the cache is empty.
     */
    isEmpty() {
        return this.queue.length === 0;
    }

    /**
     * Check if the cache queue is full and we need to flush it.
     */
    _checkForFlush() {
        if (
            (this.maxQueue > 0 && this.queueSize >= this.maxQueue)
        ) {
            eventProcessor.flushAndResetTimer();
        }
    }
}

export default CountCache;