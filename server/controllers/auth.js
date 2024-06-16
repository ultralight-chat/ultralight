import { OAuth2Client } from 'google-auth-library';
import db, { io } from '../app.js';

import jwt from 'jsonwebtoken';
import { randomBytes, generateKeyPair } from 'crypto';

export default {
  //https://developers.google.com/identity/protocols/oauth2/web-server#node.js_1
  authenticate: async (req, res) => {
    const client = new OAuth2Client(
      process.env.google_clientid,
      process.env.google_secret,
      process.env.google_callback_url
    );

    const state = randomBytes(32).toString('hex');

    req.session.state = state;

    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope:
        'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      state: state,
      redirect_uri: process.env.google_callback_url, //http ok with localhost
    });

    return res.redirect(authUrl);
  },

  createToken: async (req, res) => {
    const client = new OAuth2Client(
      process.env.google_clientid,
      process.env.google_secret,
      process.env.google_callback_url
    );

    const { tokens } = await client.getToken(req.query.code);

    client.setCredentials({ access_token: tokens.access_token });

    const url =
      'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos';
    client.request({ url }).then((r) => {
      const { givenName, familyName } = r.data.names[0];
      const email = r.data.emailAddresses.find(
        (e) => e.metadata.primary
      )?.value;
      const profileImage = r.data.photos.find((e) => {
        e.metadata.primary;
      })?.url;

      createUser(givenName, familyName, email, profileImage);
    });
  },
};

const createUser = async (email, givenName, familyName, profileImage) => {
  const data = await db.query(
    `SELECT createuser(
              \'${givenName}\',
              \'${familyName}\',
              \'${email}\',
              \'${profileImage})`
  );

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
      let token = jwt.sign(
        { data: data.rows[0].createuser },
        { key: privateKey, passphrase: process.env.session_secret },
        { algorithm: 'RS256' }
      );
      return token;
    }
  );
};
