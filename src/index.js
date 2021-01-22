import { UnlaunchFactory } from '../src/client/ulFactory.js';

var factory = UnlaunchFactory({
    core: {
        sdkKey: 'prod-sdk-9b6cf021-a1b5-4b30-9b39-533bb0c9f4b3'
    },
    intervals: {
        // fetch feature updates each 30 sec
        pollingInterval: 330,
        // publish metrics each 120 sec
        metricsFlushInterval: 120,
        // flush events every 60 seconds after the first flush
        eventsFlushInterval: 30,
        // http connection timeout 
        httpConnectionTimeout: 30
    }, 
    mode:{
        offlineMode: false
    }
});

const client = factory.client();

client.once('READY', () => {
    for (var i = 1; i < 2; i++) {
        const variation = client.variation('flag-1', `user-${i}`, 
                                { "age": "12",  
                                  "country":"pakistan" });
        console.log("variation served: " + variation)
    }
    client.shutdown();
});
