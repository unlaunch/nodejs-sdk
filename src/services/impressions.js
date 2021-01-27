import fetch from 'node-fetch';
import AbortController from 'abort-controller';

const postImpressions = async (host, sdkKey,httpTimeout, data, logger) => {
    logger.info(`'POST': ${host}/api/v1/impressions`);
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, httpTimeout);

    try {
    let res = await fetch(`${host}/api/v1/impressions`, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'X-Api-Key': `${sdkKey}`
        },
        body: JSON.stringify(data)
    })
    if (res.status == 200) {
        logger.info('Successfully pushed impressions');
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

export default postImpressions;