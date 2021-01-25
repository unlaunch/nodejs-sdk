## Overview
The Unlaunch Node.js SDK provides a Node.js API to access Unlaunch feature flags and other features. 
Using the SDK, you can easily build Java applications that can evaluate feature flags, dynamic configurations, and more.

### Important Links

- To create feature flags to use with Java SDK, login to your Unlaunch Console at [https://app.unlaunch.io](https://app.unlaunch.io)
- [Official Guide](https://docs.unlaunch.io/docs/sdks/nodejs-sdk)
- [Documentation](https://github.com/unlaunch/nodejs-sdk#section-documentation)
- [Example Project](https://github.com/unlaunch/hello-go)

## Getting Started
Here is a simple example.

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
## Build Instructions

To run all tests

```shell
npm test
```

## How to Publish
Create a new tag on GitHub in the following format vx.y.z e.g. v0.0.1

## Submitting issues
If you run into any problems, bugs, or have any questions or feedback, please report them using the [issues feature](https://github.com/unlaunch/nodejs-sdk/issues). We'll respond to all issues usually within 24 to 48 hours.

## Contributing
Please see [CONTRIBUTING](CONTRIBUTING.md) to find how you can contribute.

## License
Licensed under the Apache License, Version 2.0. See: [Apache License](LICENSE.md).

## About Unlaunch
Unlaunch is a Feature Release Platform for engineering teams. Our mission is allow engineering teams of all
sizes to release features safely and quickly to delight their customers. To learn more about Unlaunch, please visit
[unlaunch.io](https://unlaunch.io). You can sign up to get started for free at [https://app.unlaunch.io/signup](https://app.unlaunch.io/signup).
