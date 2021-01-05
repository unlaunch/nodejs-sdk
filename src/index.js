import {UnlaunchFactory} from '../src/client/ulFactory.js';

var factory = UnlaunchFactory({
    core:{
        sdkKey:'111'
        },
    intervals: {
        // fetch feature updates each 30 sec
        pollingInterval: 440,
        // publish metrics each 120 sec
        metricsFlushInterval: 120,
        // flush events every 60 seconds after the first flush
        eventsFlushInterval: 60,
        // http connection timeout 
        httpConnectionTimeout: 10
      }
  });
  
const client = factory.client();
const variation = client.variation();
console.log("Evaluation Result: "+ variation);