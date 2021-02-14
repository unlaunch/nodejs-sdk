import getFlags from "../../src/services/flags.js";

export function UlProcessor(config, store) {

    return {
        start(cb) {
            getFlags(config.core.host, config.core.sdkKey)
                .then((res) => {
                    const flags = res;
                    store.setFeatures(flags);
                    cb(null, { initialized: true })

                }).catch((err) => {
                    cb(err, null)
                })
        },
    }
}
