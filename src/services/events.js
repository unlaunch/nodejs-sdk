const fetch = require('node-fetch')
const AbortController = require('abort-controller')
const logger = require("../utils/logger/logger.js")

const postMetrics = async (host, sdkKey, httpTimeout,events, logger) => {
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
        logger.debug('debug: [Unlaunch] Successfully pushed metrics');
    } else {
        throw new Error(body.data);
    }
    
    }catch (error) {
        if (error.type && error.type == "aborted") {
            logger.error('error: [Unlaunch] Http connection timed out for metrics. Request aborted.');
        } else {
            throw new Error(error);
        }
    } finally {
        clearTimeout(timeout);
    }
}

module.exports = postMetrics