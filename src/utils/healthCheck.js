import express from 'express';
import mongoose from 'mongoose';
import logger from '../logger';

const healthCheck = express.Router();

healthCheck.get('/', (req, res, next) => {
    try {
        let status = 200;
        let databaseConnection = typeof mongoose.version !== 'undefined';
        let response = {
            uptime: process.uptime(),
            databaseConnection : databaseConnection,
            buildNumber: process.env.BUILD_NUMBER
        };
        logger.log('debug', `healthCheck status: ${status} response: ${JSON.stringify(response)}`);
        res.status(200).json(response);
    } catch (e) {
        logger.log('error', `Error in healthCheck ${e}`)
        res.status(500);
    }
});

export default healthCheck;