'use strict'

import appRoot from 'app-root-path'
import dotenv from 'dotenv'
dotenv.config();

const config = {
  
  mongodb: {
    uri : process.env.MONGODB_URI
  },

  jwt : {
    secret : process.env.JWT_SECRET,
    issuer : 'drivlab.com',
    audience : 'drivlab.com',
    expiresIn : 3600
  },

  facebookAuth : {
    clientID : process.env.FACEBOOK_CLIENT_ID,
    clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL : process.env.FACEBOOK_CALLBACK_URL,
    profileURL : process.env.FACEBOOK_PROFILE_URL
  },
  
  googleAuth : {
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : process.env.GOOGLE_CALLBACK_URL,
  },
  
  winston : {
    file : {
      level : process.env.LOGGER_LEVEL,
      filename : `${appRoot}/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    },
    console : {
      level : process.env.LOGGER_LEVEL,
      handleExceptions: true,
      json: false,
      colorize: true,
    }
  }
};

module.exports = config;