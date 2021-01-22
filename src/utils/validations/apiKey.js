import { isString } from "../../../src/utils/lang/index.js";

const usedKeysMap = {};

export function validateApiKey(maybeApiKey, logger) {
  let apiKey = false;
  if (maybeApiKey == undefined) {
    logger.log('Factory instantiation: you passed a null or undefined api_key, api_key must be a non-empty string.');
    //log.error  
   } else if (isString(maybeApiKey)) {
    if (maybeApiKey.length > 0)
      apiKey = maybeApiKey;
    else
      logger.error('Factory instantiation: you passed an empty api_key, api_key must be a non-empty string.');
  } else {
    logger.error('Factory instantiation: you passed an invalid api_key, api_key must be a non-empty string.');
  }

  return apiKey;
}
