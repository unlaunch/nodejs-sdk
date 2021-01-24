import { isString } from "../../../src/utils/lang/index.js";
import { CONSTANTS} from '../../constants/constants.js'

const usedKeysMap = {};

export function validateApiKey(maybeApiKey, logger) {
  let apiKey = false;
  if (maybeApiKey == undefined) {
    logger.log('Factory instantiation: you passed a null or undefined api_key, api_key must be a non-empty string.');
    //log.error  
   } else if (isString(maybeApiKey)) {
    if (maybeApiKey.length > 0)
      apiKey = maybeApiKey;
      if (apiKey.includes("-mob-")) {
        logger.warn("You are using 'Mobile / App SDK Key'. The SDK will only be able to download flags that " +
                "have the client-side option enabled. If you are running this application on your own " +
                "servers, use the 'Server Key' to fetch all features flags. "+
                 CONSTANTS.SDK_KEY_HELP_MSG);
    } else if (apiKey.includes("-public-")) {
        logger.warn("You are using 'Browser / Public SDK Key'. The SDK will only be able to download flags that " +
                "have the client-side option enabled. If you are running this application on your own " +
                "servers, use the 'Server Key' to fetch all features flags. "+
                CONSTANTS.SDK_KEY_HELP_MSG);
    }
    else
      logger.error('Factory instantiation: you passed an empty api_key, api_key must be a non-empty string.');
  } else {
    logger.error('Factory instantiation: you passed an invalid api_key, api_key must be a non-empty string.');
  }

  return apiKey;
}
