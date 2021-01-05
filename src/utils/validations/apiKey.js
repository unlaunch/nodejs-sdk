import { isString } from "../../../src/utils/lang/index.js";

const usedKeysMap = {};

export function validateApiKey(maybeApiKey) {
  let apiKey = false;
  if (maybeApiKey == undefined) { // eslint-disable-line eqeqeq
    console.log('Factory instantiation: you passed a null or undefined api_key, api_key must be a non-empty string.');
    //log.error  
   } else if (isString(maybeApiKey)) {
    if (maybeApiKey.length > 0)
      apiKey = maybeApiKey;
    else
      console.error('Factory instantiation: you passed an empty api_key, api_key must be a non-empty string.');
  } else {
    console.error('Factory instantiation: you passed an invalid api_key, api_key must be a non-empty string.');
  }

  // // If the apiKey is correct, we'll save it as the instance creation should work.
  // if (apiKey) {
  //   if (!usedKeysMap[apiKey]) {
  //     // If this key is not present, only warning scenarios is that we have factories for other keys.
  //     usedKeysMap[apiKey] = 1;
  //     if (Object.keys(usedKeysMap).length > 1) {
  //       console.log('Factory instantiation: You already have an instance of the Split factory. Make sure you definitely want this additional instance. We recommend keeping only one instance of the factory at all times (Singleton pattern) and reusing it throughout your application.');
  //     }
  //   } else {
  //     console.log(`Factory instantiation: You already have ${usedKeysMap[apiKey]} ${usedKeysMap[apiKey] === 1 ? 'factory' : 'factories'} with this API Key. We recommend keeping only one instance of the factory at all times (Singleton pattern) and reusing it throughout your application.`);
  //     usedKeysMap[apiKey]++;
  //   }
  // }

  return apiKey;
}
