export default class Impression {
    constructor(createdTime, type, properties, sdk, sdkVersion, secondaryKey, flagKey,userId,variationKey,flagStatus,evaluationReason,machineName, machineIp) {
      
        this.createdTime = createdTime;
        this.type = type;
        this.properties = properties;
        this.sdk =sdk;
        this.sdkVersion = sdkVersion;
        this.secondaryKey = secondaryKey;
      
        this.flagKey = flagKey;
        this.userId = userId;
        this.variationKey = variationKey;
        this.flagStatus = flagStatus;
        this.evaluationReason = evaluationReason;
        this.machineName = machineName;
        this.machineIp=machineIp;
    }
}