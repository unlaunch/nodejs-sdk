import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import logger from "../utils/logger/logger.js";


const getFlags = async (host, sdkKey, httpTimeout, logger) => {
    logger.info(`'GET': ${host}/api/v1/flags`);

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, httpTimeout);

    try {

        let res = await fetch(`${host}/api/v1/flags`, {
            method: 'GET',
            headers: {
                'X-Api-Key': `${sdkKey}`
            },
            signal: controller.signal
        })

        const body = await res.json();
        if (res.status >= 200 && res.status < 300) {
            return body.data.flags;
        } else if (res.status == 304) {
            logger.info('Polled server but there were no new changes')
        } else if(res.status == 403){
            logger.info(
                "The SDK key you provided was rejected by the server and no data was " +
                "returned. All variation evaluations will return 'control'. You must use the correct " +
                "SDK key for the project and environment you're connecting to. For more " +
                "information on how to obtain right SDK keys, see: " +
                "https://docs.unlaunch.io/docs/sdks/sdk-keys")
        }else {
            throw new Error(body.data);
        }
    } catch (error) {
        if (error.type && error.type == "aborted") {
            logger.error('Http connection timed out. Request aborted.');
        } else {
            throw new Error(error);
        }
    } finally {
        clearTimeout(timeout);
    }
}

export default getFlags;