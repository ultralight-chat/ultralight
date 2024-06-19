import { OAuth2Client } from 'google-auth-library';
import { randomBytes } from 'crypto';
import { profile } from 'console';

export const getGoogleAuthUrl = (state) => {
  const client = new OAuth2Client(
    process.env.google_clientid,
    process.env.google_secret,
    process.env.google_callback_url
  );

  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope:
      'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    state: state,
    redirect_uri: process.env.google_callback_url, //http ok with localhost
  });

  return authUrl;
};

export const getGoogleUserData = async (code) => {
  const client = new OAuth2Client(
    process.env.google_clientid,
    process.env.google_secret,
    process.env.google_callback_url
  );

  const { tokens } = await client.getToken(code);

  client.setCredentials({ access_token: tokens.access_token });

  const url =
    'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos';
  const request = await client.request({ url });

  const { givenName, familyName } = request.data.names[0];
  const email = request.data.emailAddresses.find(
    (e) => e.metadata.primary
  ).value;
  const profileImage = request.data.photos.find((e) => e.metadata.primary)?.url;

  return {
    firstName: givenName,
    lastName: familyName,
    email: email,
    profileImage: profileImage,
  };
};
