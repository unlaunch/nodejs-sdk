const Impression =require("./Impression.js")

class Event {
    constructor(createdTime,type,key,secondaryKey,properties) {
        this.createdTime = createdTime; // milliseconds
        this.type = type;
        this.key = key;
        this.secondaryKey = secondaryKey;
        this.properties = properties;    
    }
    
}

module.exports = Event