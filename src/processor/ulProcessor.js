import getFlags from "../../src/services/flags.js";

export function UlProcessor(config, store) {
    const startTime = new Date().getTime();

    return {
        start(cb) {
            getFlags(config.core.host, config.core.sdkKey)
                .then((res) => {
                    const flags = res;
                    store.setFeatures(flags);
                    cb(null, { initialized: true })

                }).catch((err) => {
                    console.error(`Error - ${err.message}`);
                    cb(err, null)
                    
                })
        }
    }
}
