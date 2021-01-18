import getFlags from "../../src/services/flags.js";

export default function PollingProcessor(config, store) {
    const processor = {};
    let stopped = false;
    let pollTimeoutId = null;

    function poll(cb) {
        if (stopped) {
            return;
        }

        const startTime = new Date().getTime();
        getFlags(config.core.host, config.core.sdkKey)
            .then((res) => {
                const flags = res;
                store.setFeatures(flags);

                pollAfterSleep(startTime, cb)

                cb(null, { initialized: true })

            }).catch((err) => {
                console.error(`Error - ${err.message}`);
                pollAfterSleep(startTime, cb)
                cb(err, null)
            })
    }

    function pollAfterSleep(startTime, cb) {
        const elapsed = new Date().getTime() - startTime;
        const sleepFor = Math.max(config.intervals.pollingInterval - elapsed, 0);
        console.log('Elapsed: %d ms, sleeping for %d ms', elapsed, sleepFor);
        pollTimeoutId = setTimeout(() => {
            poll(cb);
        }, sleepFor);
    }

    processor.start = cb => poll(cb);

    processor.stop = () => stopped = true;

    processor.close = () => pollTimeoutId && clearTimeout(pollTimeoutId)

    return processor;
}

