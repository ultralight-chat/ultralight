import Router from 'express-promise-router';

// validators
import * as v from '../validators/authValidator.js';

// controllers
import userAuth from '../controllers/auth.js';

const router = new Router();

router
  .get('/auth/google', userAuth.authPrompt)
  .get('/auth/google/callback', v.auth, userAuth.authCallback);

export default router;
