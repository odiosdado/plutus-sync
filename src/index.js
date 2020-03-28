'use strict'

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import passport from 'passport'
import routes from './routes'
import database from './database/database'
import logger from './logger'
import healthCheck from './utils/healthCheck';

database.setupConnection();

const app = express();

if("development" === process.env.ENVIRONMENT){
  app.use(cors());
};

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/healthCheck', healthCheck);
app.use('/v1/', routes);

app.listen(3000, () => {
  logger.log('debug','App running on port: 3000');
});

export default app;