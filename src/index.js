import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import passport from 'passport'
import router from './routes'
import setupConnection from './database'
import logger from './logger'
import healthCheck from './utils/healthCheck';

setupConnection();

const app = express();

if("development" === process.env.ENVIRONMENT){
  app.use(cors());
};

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/health-check', healthCheck);
app.use('/v1/', router);

app.listen(process.env.PORT, () => {
  logger.log('debug','App running on port: 3000');
});

export default app;