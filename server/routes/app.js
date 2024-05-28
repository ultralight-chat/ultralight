import Router from 'express-promise-router';

// controllers
import app from '../controllers/app.js';

// import * as a from '../auth.js'
import passport from 'passport';

const router = new Router();

router
.get('/auth/google', passport.authenticate("google", { scope: [ "profile", "email" ]}))
.get('/auth/google/callback', passport.authenticate("google", {session: false}), (req,res) => app.authenticate(req, res))

export default router;