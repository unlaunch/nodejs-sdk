class UnlaunchFeature{
    constructor(variationKey= '', evaluationReason= '', flagKey= '', configs = {}){
        this.variationKey = variationKey;
        this.evaluationReason = evaluationReason;
        this.flagKey = flagKey;
        this.configs = configs;
    }

    variationConfiguration() {
        return this.configs;
    }
}

module.exports =  UnlaunchFeature