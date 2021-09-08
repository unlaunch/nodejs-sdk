const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
};    

const logger = (level) =>{
    return winston.createLogger({
    level ,
    format:combine(
        timestamp(), 
        printf(({ level, message, timestamp }) => { 
          return `${message}`;
    })
    ),
    transports: [
        new winston.transports.Console()
    ],
    exitOnError: false,
});

}

module.exports = logger