import { auth } from '@googleapis/oauth2';

import db, { io } from '../app.js';

import jwt from 'jsonwebtoken';
import { generateKeyPair, randomBytes } from 'crypto';

// import dotenv from "dotenv";

// dotenv.config({ path: './config/config.env' });

export default {
  authenticate: async (req, res) => {
    try {
      const client = new auth.OAuth2(
        process.env.google_clientid,
        process.env.google_secret,
        process.env.google_callback_url
      );

      const state = randomBytes(32).toString('hex');

      req.session.state = state;

      const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: 'profile',
        include_granted_scopes: true,
        state: state,
      });

      res.redirect(authUrl);

      const data = await db.query(
        `SELECT createuser(
          \'${profile.name.givenName}\', 
          \'${profile.name.familyName}\', 
          \'${profile.emails[0].value}\',
          \'${profile.photos[0].value}\')`
      );

      if (data?.rows[0]?.createuser) {
        generateKeyPair(
          'rsa',
          {
            modulusLength: 4096,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem',
            },
            privateKeyEncoding: {
              type: 'pkcs8',
              format: 'pem',
              cipher: 'aes-256-cbc',
              passphrase: process.env.session_secret,
            },
          },
          (err, publicKey, privateKey) => {
            const token = jwt.sign(
              { data: data.rows[0].createuser },
              { key: privateKey, passphrase: process.env.session_secret },
              { algorithm: 'RS256' }
            );
            return (
              res
                .set('content-type', 'application/JSON')
                .cookie('user', JSON.stringify(data.rows[0].createuser), {
                  maxAge: 99999,
                })
                .cookie('token', token.toString(), { maxAge: 99999 })
                // .setHeader("token", token.toString())
                .redirect('http://fakedomain.com:19006')
            );
            //.json({token: token, user: data.rows[0].createuser})
          }
        );
      }

      return res.status(401).send();
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  verifytoken: async (req, res, next) => {},
};
