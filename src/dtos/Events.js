import Impression from "./Impression.js";

export default class Event {
    constructor(createdTime,type,key,secondaryKey,properties) {
        this.createdTime = createdTime; // milliseconds
        this.type = type;
        this.key = key;
        this.secondaryKey = secondaryKey;
        this.properties = properties;    
    }
    
}