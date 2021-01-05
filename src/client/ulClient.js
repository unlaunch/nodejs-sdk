
export function ulClient(config) {
    return {
        config: config,
        variation : (flagKey,identity,attributes={}) =>{
            if(flagKey == undefined || flagKey.length < 0){
                console.error('Please provide valid flagKey');
                return "control";
            }
            if(identity == undefined || identity.length<0){
                console.error('Please provide valid identity')
                return "control";
            }
            console.log('evaluating variation')
            return "variation-1";   
        }
    }

}