### Example to use Node.js SDK

```$xslt
let factory = UnlaunchFactory({
    core:{
        sdkKey:'prod-sdk-9b6cf021-a1b5-4b30-9b39-533bb0c9f4b3'
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

client.once('READY',()=> {
  
    const variation = client.variation('flag-1','user123');
    console.log("variation served: "+ variation)
    
});
```
### Steps to run

1. npm install

2. npm start
