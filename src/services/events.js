import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import logger from "../utils/logger/logger.js";

const postMetrics = async (host, sdkKey, events, httpTimeout, logger) => {
    logger.info(`'POST': ${host}/api/v1/events`);
    // console.log(`RES BODY: ${events}`)
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, httpTimeout);

    try {
    let res = await fetch(`${host}/api/v1/events`, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'X-Api-Key': `${sdkKey}`
        },
        body: JSON.stringify(events)
    })

    if (res.status == 200) {
        logger.info('Successfully pushed metrics');
    } else {
        throw new Error(body.data);
    }
    
    }catch (error) {
        if (error.type && error.type == "aborted") {
            logger.error('Http connection timed out. Request aborted.');
        } else {
            throw new Error(error);
        }
    } finally {
        clearTimeout(timeout);
    }
}

export default postMetrics;