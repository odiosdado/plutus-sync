'use strict'

import Winston from 'winston'
import config from '../constants/config'

const logger = Winston.createLogger({
    transports: [
        new Winston.transports.File(config.winston.file),
        new Winston.transports.Console(config.winston.console)
    ],
    exitOnError: false,
});

module.exports = logger