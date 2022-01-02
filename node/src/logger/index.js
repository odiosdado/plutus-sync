import Winston from 'winston'
import config from '../constants/config'

const logger = Winston.createLogger({
    transports: [
        new Winston.transports.Console(config.winston.console)
    ],
    exitOnError: false,
});

export default logger;