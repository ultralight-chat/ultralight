import Router from 'express-promise-router';

// validators
import * as v from '../validators/authValidator.js';

// controllers
import userAuth from '../controllers/auth.js';

const router = new Router();

router
  .get('/auth/google', userAuth.authenticate)
  .get('/auth/google/callback', v.auth, userAuth.createToken);

export default router;
