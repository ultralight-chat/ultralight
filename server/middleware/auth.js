import passport from 'passport';
import jwt from 'jsonwebtoken';
import { generateKeyPair } from 'crypto';
import dotenv from 'dotenv';
import db from '../app.js';

dotenv.config({ path: './config/.env' });

// passport.use(
//   new Strategy(
//     {
//       clientID: process.env.google_clientid,
//       clientSecret: process.env.google_secret,
//       callbackURL: process.env.google_callback_url,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const data = await db.query(
//           `SELECT createuser(
//           \'${profile.given_name}\',
//           \'${profile.family_name}\',
//           \'${profile.email}\')`
//         );

//         generateKeyPair(
//           'rsa',
//           {
//             modulusLength: 4096,
//             publicKeyEncoding: {
//               type: 'spki',
//               format: 'pem',
//             },
//             privateKeyEncoding: {
//               type: 'pkcs8',
//               format: 'pem',
//               cipher: 'aes-256-cbc',
//               passphrase: process.env.session_secret,
//             },
//           },
//           (err, publicKey, privateKey) => {
//             let token = jwt.sign(
//               { data: data.rows[0].createuser },
//               { key: privateKey, passphrase: process.env.session_secret },
//               { algorithm: 'RS256' }
//             );

//             done(null, token);
//           }
//         );
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );

passport.serializeUser(async (profile, done) => {
  done(null, profile);
});

passport.deserializeUser(function (profile, cb) {
  process.nextTick(function () {
    return cb(null, profile);
  });
});

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
