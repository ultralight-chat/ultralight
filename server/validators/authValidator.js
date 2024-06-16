import checkAPIs from 'express-validator';
const { check, validationResult } = checkAPIs;

export const auth = [
  check('state')
    .custom((state, { req }) => state === req.session.state)
    .bail()
    .withMessage('Login failed. Please try again.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
