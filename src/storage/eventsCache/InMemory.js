import { CONFIGURATIONS, EVENTS, EVENTS_COUNT } from '../../utils/store/constants.js';
import EventsProcessor from '../../events/eventProcessor.js';
import AsyncLock from 'async-lock';

const lock = new AsyncLock();

// const MAX_QUEUE_BYTE_SIZE = 5 * 1024 * 1024; // 5M

class EventsCache {

    constructor(store) {
        this.store = store;
        const settings = store.get(CONFIGURATIONS);
        const events = store.get(EVENTS);

        this.onFullQueue = false;
        this.maxQueue = settings.size.eventsQueueSize;
        if (events && events.length > 0) {
            this.queue = events;
            this.queueSize = events.length;
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
     * Add a new event object at the end of the queue.
     */
    track(event) {
        // this.queue.push(data);
        if (!event) {
            return false
        }

        let events = this.store.get(EVENTS);

        if (events) {
            events.push(event)
        } else {
            events = [];
            events.push(event)
        }

        this.store.set(EVENTS, events)
        // logger.info('Store events:', this.store.get(EVENTS));

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

export default EventsCache;