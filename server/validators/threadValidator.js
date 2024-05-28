import checkAPIs from 'express-validator';
const { body, check, validationResult } = checkAPIs;

export const getThreads  = [
  check('userid')
    .trim()
    .isInt()
    .bail()
    .withMessage('userid must be an integer!'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];

export const updateThread = [
  check('threadid')
    .trim()
    .isInt()
    .bail()
    .withMessage('threadid must be an integer!'),
  check('name')
    .isString()
    .bail()
    .escape(),
  check('modifiedby')
    .trim()
    .isInt()
    .bail()
    .withMessage('modifiedby must be an integer!'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];

export const deleteThread = [
  check('threadid')
    .trim()
    .isInt()
    .bail()
    .withMessage('threadid must be an integer!'),
  check('deletedby')
    .trim()
    .isInt()
    .bail()
    .withMessage('deletedby must be an integer!'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];

export const createThread = [
  check('name')
    .isString()
    .bail()
    .escape(),
  check('createdby')
    .trim()
    .isInt()
    .bail()
    .withMessage('createdby must be an integer!'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];

export const createTopic = [
  check('threadid')
    .trim()
    .isInt()
    .bail()
    .withMessage('threadid must be an integer!'),
  check('name')
    .isString()
    .bail()
    .escape(),
  check('createdby')
    .trim()
    .isInt()
    .bail()
    .withMessage('createdby must be an integer!'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];

export const readMessage = [
  check('threadid')
    .trim()
    .isInt()
    .bail()
    .withMessage('threadid must be an integer!'),
  check('messageid')
  .trim()
  .isInt()
  .bail()
  .withMessage('messageid must be an integer!'),
  check('readbyid')
    .trim()
    .isInt()
    .bail()
    .withMessage('readbyid must be an integer!'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];