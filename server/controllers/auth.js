import jwt from 'jsonwebtoken';
import { randomBytes, generateKeyPair, generateKeyPairSync } from 'crypto';

import db, { io } from '../app.js';
import { getGoogleAuthUrl, getGoogleUserData } from '../services/google.js';

export default {
  //https://developers.google.com/identity/protocols/oauth2/web-server#node.js_1
  authPrompt: async (req, res) => {
    const state = randomBytes(32).toString('hex');
    req.session.state = state;

    const authUrl = getGoogleAuthUrl(state);
    res.redirect(authUrl);
  },
  authCallback: async (req, res) => {
    const googleUser = await getGoogleUserData(req.query.code);
    const data = await db.query(
      `SELECT createuser(
        \'${googleUser.firstName}\',
        \'${googleUser.lastName}\',
        \'${googleUser.email}\',
        \'${googleUser.profileImage || null}\')`
    );

    const userString = data.rows[0].createuser;
    const user = JSON.parse(userString);

    const token = createJwt(userString, 'google');
    res.set('x-token', token).redirect(`/threads/users/${String(user.userid)}`);
  },
};

const createJwt = (user, type) => {
  const { privateKey } = generateKeyPairSync('rsa', {
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
  });

  let token = jwt.sign(
    { tokenType: type, data: user },
    { key: privateKey, passphrase: process.env.session_secret },
    { algorithm: 'RS256' }
  );
  return token;
};
