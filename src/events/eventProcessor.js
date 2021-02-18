import { CONFIGURATIONS, EVENTS, EVENTS_COUNT } from '../utils/store/constants.js';
import Events from '../dtos/Events.js'
import Impression from '../dtos/Impression.js'
import postMetrics from "../services/events.js";
import postImpressions from "../services/impressions.js";

export default function EventsProcessor(config, storage) {
  let settings = storage.get(CONFIGURATIONS)
  let eventsPublishId = false;
  let countPublishId = false;
  let closeProcessor = false;
  let eventsCount = storage.get(EVENTS_COUNT);
  let events = storage.get(EVENTS);

  const pushCounts = () => {

    const startTime = new Date().getTime();
    eventsCount = storage.get(EVENTS_COUNT);

    if (!eventsCount) {
      flushCountAfterSleep(startTime)
      return Promise.resolve;
    }

    config.logger.info(`Pushing ${eventsCount.length} queued count events.`);

    const data = [];
    eventsCount.map(e => {
      var [key, vk] = e.key.split(',');
      const countObj = new Events(
        Math.floor(new Date().getTime() / 1000) * 1000,
        "VARIATIONS_COUNT_EVENT",
        key,
        null,
        {
          [vk]: e.count
        }

      )
      data.push(countObj)
    });

    if (data.length > 0) {
      postMetrics(
        settings.core.host,
        settings.core.sdkKey,
        settings.intervals.httpConnectionTimeout,
        data,
        config.logger
      ).then(res => {
        storage.set(EVENTS_COUNT, []) // clear the queue.
      }).catch(err => {
      })
    }
    
    !closeProcessor && flushCountAfterSleep(startTime)

  }

  const flushCountAfterSleep = (startTime) => {
    const elapsed = new Date().getTime() - startTime;
    const sleepFor = Math.max(config.intervals.metricsFlushInterval - elapsed, 0);
    countPublishId = setTimeout(() => {
      pushCounts();
    }, sleepFor);
  }

  const pushEvents = () => {
    if(settings.sendImpression){
      const startTime = new Date().getTime();
      events = storage.get(EVENTS);
  
      if (!events) {
        flushEventsAfterSleep(startTime)
        return Promise.resolve;
      }

      config.logger.info(`Pushing ${events.length} queued impression events.`);
  
      if (events.length > 0) {
        postImpressions(
          settings.core.host,
          settings.core.sdkKey,
          settings.intervals.httpConnectionTimeout,
          events,
          config.logger
        ).then(res => {
          storage.set(EVENTS, []) // clear the queue.
        }).catch(err => {
        })
      }
  
      !closeProcessor && flushEventsAfterSleep(startTime)  
    }
  }

  const flushEventsAfterSleep = (startTime) => {
    const elapsed = new Date().getTime() - startTime;
    const sleepFor = Math.max(config.intervals.eventsFlushInterval - elapsed, 0);
    eventsPublishId = setTimeout(() => {
      pushEvents();
    }, sleepFor);
  }

  const close = () => {
    closeProcessor = true;
    eventsCount = storage.get(EVENTS_COUNT);
    events = storage.get(EVENTS);
    
    if (eventsCount && eventsCount.length > 0) pushCounts();
    countPublishId && clearTimeout(countPublishId);

    if (events && events.length > 0) pushEvents();
    eventsPublishId && clearTimeout(eventsPublishId);
  }

  return {
    start() {
      pushEvents();
      pushCounts();
    },

    flush() {
      return pushCounts();
    },

    close() {
      return close()
    },

    flushAndResetTimer() {
      // Reset the timer and push the events.
      countPublishId && clearTimeout(countPublishId);
      pushCounts();

      eventsPublishId && clearTimeout(eventsPublishId);
      pushEvents();
    }
  };
};