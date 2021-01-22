import winston from 'winston';
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

const logger = winston.createLogger({
    level: 'info',
    // format: winston.format.json(),
    format:combine(
        timestamp(), // get the time stamp part of the full log message
        printf(({ level, message, timestamp }) => { // formating the log outcome to show/store 
          return `${message}`;
    })
    ),
    transports: [
        new winston.transports.Console()
    ],
    exitOnError: false,
});

export default logger;