'use strict'

import dotenv from 'dotenv'
dotenv.config();

const config = {
  
  mongodb: {
    uri : process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASS
    }
  },

  jwt : {
    secret : process.env.JWT_SECRET,
    issuer : 'plutus.com',
    audience : 'plutus.com',
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
    console : {
      level : process.env.LOGGER_LEVEL,
      handleExceptions: true,
      json: false,
      colorize: true,
    }
  }
};
export default config;