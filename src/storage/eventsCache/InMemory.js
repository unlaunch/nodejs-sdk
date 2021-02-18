import { CONFIGURATIONS, EVENTS, EVENTS_COUNT } from '../../utils/store/constants.js';

class EventsCache {

    constructor(store) {
        this.store = store;
        const settings = store.get(CONFIGURATIONS);
        this.maxQueue = settings.size.eventsQueueSize;

        const events = store.get(EVENTS);
        if (events && events.length > 0) {
            this.queue = events;
            this.queueSize = events.length;
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
     * Add a new event object at the end of the queue.
     */
    track(event) {
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

        return true;
    }
}

export default EventsCache;