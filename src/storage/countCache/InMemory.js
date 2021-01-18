import { CONFIGURATIONS, EVENTS,EVENTS_COUNT } from '../../utils/store/constants.js';
import EventProcessor from "../../events/eventProcessor.js";
import AsyncLock from 'async-lock';

const lock = new AsyncLock();


class CountCache {

    constructor(store) {
        this.store = store;
        const settings = store.get(CONFIGURATIONS);
        const eventsCount = store.get(EVENTS_COUNT);

        this.onFullQueue = false;
        this.maxQueue = settings.size.metricsCapacity;
        if (eventsCount && eventsCount.length > 0) {
            this.queue = eventsCount;
            this.queueSize = eventsCount.length;
        } else {
            this.queue = [];
            this.queueSize = 0;
        }
        this._checkForFlush(); // Events is ready, check the queue.
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
        // this.queue.push(data);
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
                events.push(eventsCountObj)
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
        console.log('Store count:',this.store.get(EVENTS_COUNT));

        // this._checkForFlush();

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