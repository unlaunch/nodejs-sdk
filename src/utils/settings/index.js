import objectAssign from 'object-assign';
import logger from "../logger/logger.js";
import { merge } from "../../../src/utils/lang/index.js";

const base = {
  core:{
    sdkKey:'',
    host:'https://api-qa.unlaunch.io'
  },
  intervals: {
    // fetch feature updates each 30 sec
    pollingInterval: 15,
    // publish metrics each 120 sec
    metricsFlushInterval: 120,
    // flush events every 60 seconds after the first flush
    eventsFlushInterval: 40,
    // http connection timeout 
    httpConnectionTimeout: 20,
  },
  size:{
    eventsQueueSize: 10,
    metricsQueueSize: 10
  },
  mode: {
    offlineMode: false
  },

  urls: {
    // CDN having all the information for your environment
    sdk: '/api/v1/flags',
    // Storage for your SDK events
    events: '/api/v1/events',
    // Storage for your SDK impressions
    impressions:'/api/v1/impressions'
  },
  logger: logger
};

function fromSecondsToMillis(n) {
  return Math.round(n * 1000);
}

function defaults(custom) {
  const withDefaults = merge(base, custom);

  // make sure that no setting is set below its minimum value or is wrong
	if(withDefaults.intervals.pollingInterval  < base.intervals.pollingInterval){
    withDefaults.intervals.pollingInterval = base.intervals.pollingInterval
  }

  if(withDefaults.intervals.eventsFlushInterval  < base.intervals.eventsFlushInterval){
    withDefaults.intervals.eventsFlushInterval = base.intervals.eventsFlushInterval
  }

  if(withDefaults.intervals.httpConnectionTimeout  < base.intervals.httpConnectionTimeout){
    withDefaults.intervals.httpConnectionTimeout = base.intervals.httpConnectionTimeout
  }
  
  if(withDefaults.intervals.metricsFlushInterval  < base.intervals.metricsFlushInterval){
    withDefaults.intervals.metricsFlushInterval = base.intervals.metricsFlushInterval
  }
  
  if(withDefaults.size.metricsQueueSize < base.intervals.metricsQueueSize){
    withDefaults.intervals.metricsQueueSize = base.intervals.metricsQueueSize
  }

  withDefaults.intervals.pollingInterval = fromSecondsToMillis(withDefaults.intervals.pollingInterval);
  withDefaults.intervals.metricsFlushInterval = fromSecondsToMillis(withDefaults.intervals.metricsFlushInterval);
  withDefaults.intervals.httpConnectionTimeout = fromSecondsToMillis(withDefaults.intervals.httpConnectionTimeout);
  withDefaults.intervals.eventsFlushInterval = fromSecondsToMillis(withDefaults.intervals.eventsFlushInterval);

  // // mode
  //  withDefaults.mode.offlineMode = false;

  // Startup periods
  //  withDefaults.startup.requestTimeoutBeforeReady = fromSecondsToMillis(withDefaults.startup.requestTimeoutBeforeReady);
  //  withDefaults.startup.readyTimeout = fromSecondsToMillis(withDefaults.startup.readyTimeout);
  //  withDefaults.startup.eventsFirstPushWindow = fromSecondsToMillis(withDefaults.startup.eventsFirstPushWindow);

  return withDefaults;
}

export const ConfigsFactory = (configurations) => objectAssign(Object.create({}), defaults(configurations));
