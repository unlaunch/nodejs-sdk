import getFlags from "../../src/services/flags.js";

export default function PollingProcessor(configs, store) {
    const processor = {};
    let stopped = false;
    let pollTimeoutId = null;

    function poll(cb) {
        if (stopped) {
            return;
        }

        const startTime = new Date().getTime();
        getFlags(
            configs.core.host,
            configs.core.sdkKey,
            configs.intervals.httpConnectionTimeout,
            configs.logger
        ).then((res) => {
            const flags = res;
            store.setFeatures(flags);

            pollAfterSleep(startTime, cb)

            cb(null, { initialized: true })

        }).catch((err) => {
            configs.logger.error(`Error - ${err.message}`);
            pollAfterSleep(startTime, cb)
            cb(err, null)
        })
    }

    function pollAfterSleep(startTime, cb) {
        const elapsed = new Date().getTime() - startTime;
        const sleepFor = Math.max(configs.intervals.pollingInterval - elapsed, 0);
        configs.logger.info(`Elapsed: ${elapsed} ms, sleeping for ${sleepFor} ms`);
        pollTimeoutId = setTimeout(() => {
            poll(cb);
        }, sleepFor);
    }

    processor.start = cb => poll(cb);

    processor.stop = () => stopped = true;

    processor.close = () => pollTimeoutId && clearTimeout(pollTimeoutId)

    return processor;
}

