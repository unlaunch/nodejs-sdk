import fetch from 'node-fetch';
import AbortController from 'abort-controller';

const getFlags = async (sync0Complete, s3BucketHost, host, sdkKey, httpTimeout, lastUpdatedTime, logger) => {
   
    if(!sync0Complete){
        return sync0FromS3(s3BucketHost, host, sdkKey, httpTimeout, lastUpdatedTime, logger)
    } else{
        return regularServerSync(host, sdkKey, httpTimeout, lastUpdatedTime, logger);        
    }
}


const sync0FromS3 = async(s3BucketHost, host, sdkKey, httpTimeout, lastUpdatedTime, logger) => {
    logger.info(`'GET': ${s3BucketHost}/${sdkKey}`);

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, httpTimeout);

    try {

        let res = await fetch(`${s3BucketHost}/${sdkKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        })

        if (res.status == 200) {
            const body = await res.json();
            if(body.flags.length){
                return {
                    "flags": body.flags,
                    "lastUpdatedTime": null,
                };
            }else{
                return regularServerSync( host, sdkKey, httpTimeout, lastUpdatedTime, logger);          
            }
          
        } else {
            // If the s3 object doesn't exist, attempt a regular sync
            return regularServerSync( host, sdkKey, httpTimeout, lastUpdatedTime, logger);          
        }
    } catch (error) {
        // Should we even show these errors?
        if (error.type && error.type == "aborted") {
            logger.error('Http connection timed out. Request aborted.');
        } else {
            logger.error("Error occurred during initial s3 sync: " + error);
        }

        // Fallback to regular sync in case of any error
        return regularServerSync( host, sdkKey, httpTimeout, lastUpdatedTime, logger);          

    } finally {
        clearTimeout(timeout);
    }
}

const regularServerSync = async(host, sdkKey, httpTimeout, lastUpdatedTime, logger) => {
    logger.info(`'GET': ${host}/api/v1/flags`);
  
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, httpTimeout);

    try {

        let res = await fetch(`${host}/api/v1/flags`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': `${sdkKey}`,
                'If-Modified-Since': `${lastUpdatedTime}`
            },
            signal: controller.signal
        })

        if (res.status >= 200 && res.status < 300) {
            const body = await res.json();
            return {
                "flags": body.data.flags,
                "lastUpdatedTime": res.headers.get('Last-modified'),
            };
        } else if (res.status == 304) {
            logger.info('Polled data from server but there were no new changes')
        } else if (res.status == 403) {
            logger.info(
                "The SDK key you provided was rejected by the server and no data was " +
                "returned. All variation evaluations will return 'control'. You must use the correct " +
                "SDK key for the project and environment you're connecting to. For more " +
                "information on how to obtain right SDK keys, see: " +
                "https://docs.unlaunch.io/docs/sdks/sdk-keys")
        } else {
            const body = await res.json();
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