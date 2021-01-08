import objectAssign from 'object-assign';
import { merge } from "../../../src/utils/lang/index.js";

const base = {
  core:{
    sdkKey:'',
    host:'https://api-qa.unlaunch.io'
  },
  intervals: {
    // fetch feature updates each 30 sec
    pollingInterval: 30,
    // publish metrics each 120 sec
    metricsFlushInterval: 120,
    // flush events every 60 seconds after the first flush
    eventsFlushInterval: 60,
    // http connection timeout 
    httpConnectionTimeout: 10
  },
  mode: {
    offlineMode: false
  },

  urls: {
    // CDN having all the information for your environment
    sdk: '/api/v1/flags',
    // Storage for your SDK events
    events: '/api/v1/events'
  },

};

function fromSecondsToMillis(n) {
  return Math.round(n * 1000);
}

function defaults(custom) {
  const withDefaults = merge(base, custom);

  // // Scheduler periods
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
