import objectAssign from 'object-assign';
import logger from "../logger/logger.js";
import { merge } from "../../../src/utils/lang/index.js";

const base = {
  core:{
    sdkKey:'',
    host:'https://api.unlaunch.io',
    s3BucketHost : 'https://api-unlaunch-io-master-flags.s3-us-west-1.amazonaws.com',
  },
  intervals: {
    // fetch feature updates each 15 sec
    pollingInterval: 15,
    // publish metrics each 15 sec
    metricsFlushInterval: 15,
    // flush events every 15 seconds 
    eventsFlushInterval: 15,
    // http connection timeout 
    httpConnectionTimeout: 1,
  },
  size:{
    eventsQueueSize: 100,
    metricsQueueSize: 100
  },
  mode: {
    offlineMode: false
  },

  urls: {
    sdk: '/api/v1/flags',
    events: '/api/v1/events',
    impressions:'/api/v1/impressions'
  },
  sendImpression:false,
  logger: logger
};

function fromSecondsToMillis(n) {
  return n * 1000;
}

function defaults(custom) {
  const withDefaults = merge(base, custom);
  
  if (withDefaults.core.host != "https://api.unlaunch.io") {
    withDefaults.core.s3BucketHost = "https://app-qa-unlaunch-io-master-flags.s3-us-west-1.amazonaws.com";
  }

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

  return withDefaults;
}

export const ConfigsFactory = (configurations) => objectAssign(Object.create({}), defaults(configurations));
