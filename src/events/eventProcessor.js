import { CONFIGURATIONS, EVENTS, EVENTS_COUNT } from '../utils/store/constants.js';
import Events from '../dtos/Events.js'
import Impression from '../dtos/Impression.js'
//services
import postMetrics from "../services/events.js";
import postImpressions from "../services/impressions.js";

export default function EventsProcessor(config, storage) {
  let queue = [];
  let settings = storage.get(CONFIGURATIONS)
  let eventsPublishId = false;
  let countPublishId = false;
  const eventsCount = storage.get(EVENTS_COUNT);
  const events = storage.get(EVENTS);

  const pushCounts = () => {

    const startTime = new Date().getTime();

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
        data,
        config.logger
      ).then(res => {
        storage.set(EVENTS_COUNT, []) // we always clear the queue.
        flushCountAfterSleep(startTime)
      }).catch(err => {
        flushCountAfterSleep(startTime)
      })
    }

  }

  const flushCountAfterSleep = (startTime) => {
    const elapsed = new Date().getTime() - startTime;
    const sleepFor = Math.max(config.intervals.metricsFlushInterval - elapsed, 0);
    config.logger.info(`Count Metrics: Elapsed: ${elapsed} ms, sleeping for ${sleepFor} ms`);

    countPublishId = setTimeout(() => {
      pushCounts();
    }, sleepFor);
  }

  const pushEvents = () => {
    const startTime = new Date().getTime();
    if (!events) {
      flushEventsAfterSleep(startTime)
      return Promise.resolve;
    }

    config.logger.info(`Pushing ${events.length} queued impression events.`);

    if (events.length > 0) {
      postImpressions(
        settings.core.host,
        settings.core.sdkKey,
        events,
        config.logger
      ).then(res => {
        storage.set(EVENTS, []) // we always clear the queue.
        flushEventsAfterSleep(startTime)
      }).catch(err => {
        flushEventsAfterSleep(startTime)
      })
    }

  }

  const flushEventsAfterSleep = (startTime) => {
    const elapsed = new Date().getTime() - startTime;
    const sleepFor = Math.max(config.intervals.eventsFlushInterval - elapsed, 0);
    config.logger.info(`Impression Metrics: Elapsed: ${elapsed} ms, sleeping for ${sleepFor} ms`);

    eventsPublishId = setTimeout(() => {
      pushEvents();
    }, sleepFor);
  }

  const close = () => {
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
      config.logger.info('Flushing events and reseting timer.');

      countPublishId && clearTimeout(countPublishId);
      pushCounts();

      countPublishId && clearTimeout(countPublishId);
      pushEvents();
    }
  };
};