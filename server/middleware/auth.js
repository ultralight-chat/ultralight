import passport from 'passport';
import jwt from 'jsonwebtoken';
import { generateKeyPair } from 'crypto';
import dotenv from 'dotenv';
import db from '../app.js';

dotenv.config({ path: './config/.env' });

passport.serializeUser(async (profile, done) => {
  done(null, profile);
});

passport.deserializeUser(function (profile, cb) {
  process.nextTick(function () {
    return cb(null, profile);
  });
});

export const verifySession = (req, res, next) => {
  next();
};

function verifytoken(req, res, next) {
  if (req.path.includes('/auth')) return next();

  let token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send();
  }

  jwt.verify(
    token,
    process.env.session_secret,
    { algorithms: ['RS256'] },
    (err, decoded) => {
      if (err) {
        return res.status(401).send();
      }

      req.userId = decoded.id;
    }
  );

  next();
}

export { verifytoken };
