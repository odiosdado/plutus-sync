'use strict';

const jwt = require('jsonwebtoken');
const config = require('../constants/config');

let createToken = (user) => {
  return jwt.sign({
    iss: config.jwt.issuer,
    aud: config.jwt.audience,
    sub: user.id,
    email: user.email
  }, 
  config.jwt.secret,
  {
    expiresIn: config.jwt.expiresIn
  });
};

module.exports = {
  generateToken: (req, res, next) => {
    req.token = createToken(req.user);
    return next();
  },
  sendToken: (req, res) => {
      return res.status(200).send({
        access_token: req.token,
        token_type: "bearer",
        expires_in: config.jwt.expiresIn
      });
  },
};