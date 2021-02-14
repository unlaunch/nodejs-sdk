class UnlaunchFeature{
    constructor(variationKey= '', evaluationReason= '', flagKey= '', configs = {}){
        this.variationKey = variationKey;
        this.evaluationReason = evaluationReason;
        this.flagKey = flagKey;
        this.configs = configs;
    } 
}

export default UnlaunchFeature