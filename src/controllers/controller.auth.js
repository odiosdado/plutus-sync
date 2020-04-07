import jwt from 'jsonwebtoken';
import config from '../constants/config';

const createToken = (user) => {
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

export const generateToken = (req, res) => {
  return res.status(200).send({
    access_token: createToken(req.user),
    token_type: "bearer",
    expires_in: config.jwt.expiresIn
  });
}