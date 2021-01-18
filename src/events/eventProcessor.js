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

  const pushCounts = () => {
    
    const startTime = new Date().getTime();
    const eventsCount = storage.get(EVENTS_COUNT)
    
    if (!eventsCount) {
      flushCountAfterSleep(startTime)
      return Promise.resolve;
    }

    console.log(`Pushing ${eventsCount.length} queued count events.`);
    
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

    if(data.length > 0){
      postMetrics(settings.core.host,settings.core.sdkKey,data)
      .then(res => {
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
    console.log('Count Metrics: Elapsed: %d ms, sleeping for %d ms', elapsed, sleepFor);

    countPublishId = setTimeout(() => {
      pushCounts();
    }, sleepFor);
  }

  const pushEvents = () => {    
    const startTime = new Date().getTime();
    const events = storage.get(EVENTS)
    
    if (!events) {
      flushEventsAfterSleep(startTime)
      return Promise.resolve;
    }

    console.log(`Pushing ${events.length} queued impression events.`);
    
    if(events.length > 0){
      postImpressions(settings.core.host, settings.core.sdkKey,events)
      .then(res => {
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
    console.log('Impression Metrics: Elapsed: %d ms, sleeping for %d ms', elapsed, sleepFor);

    eventsPublishId = setTimeout(() => {
      pushEvents();
    }, sleepFor);
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
      pushCounts();
      countPublishId && clearTimeout(countPublishId);
      
      pushEvents();
      eventsPublishId && clearTimeout(eventsPublishId);
    },

    flushAndResetTimer() {
      // Reset the timer and push the events.
      console.log('Flushing events and reseting timer.');
      
      countPublishId && clearTimeout(countPublishId);
      pushCounts();
      
      countPublishId && clearTimeout(countPublishId);
      pushEvents();
    }
  };
};