import checkAPIs from 'express-validator';
const { body, check, validationResult } = checkAPIs;

export const getConversationMembers  = [
  check('threadid')
    .trim()
    .isInt()
    .bail()
    .withMessage('threadid must be an integer!'),
  check('parentid')
    .trim()
    .isInt()
    .bail()
    .withMessage('parentid must be an integer!'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];

export const getThreadMembers = [
  check('threadid')
    .trim()
    .isInt()
    .bail()
    .withMessage('threadid must be an integer!'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];

export const getUser = [
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

export const getConversations = [
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

export const updateNickname = [
  check('threadid')
    .trim()
    .isInt()
    .bail()
    .withMessage('threadid must be an integer!'),
  check('userid')
    .trim()
    .isInt()
    .bail()
    .withMessage('userid must be an integer!'),
  check('modifiedby')
    .trim()
    .isInt()
    .bail()
    .withMessage('modifiedby must be an integer!'),
  check('nickname')
    .isString()
    .bail()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];

export const joinThread = [
  check('threadid')
    .trim()
    .isInt()
    .bail()
    .withMessage('threadid must be an integer!'),
  check('userid')
    .trim()
    .isInt()
    .bail()
    .withMessage('userid must be an integer!'),
  check('addedby')
    .trim()
    .isInt()
    .bail()
    .withMessage('addedby must be an integer!'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];

export const leaveThread = [
  check('threadid')
    .trim()
    .isInt()
    .bail()
    .withMessage('threadid must be an integer!'),
  check('removedby')
    .trim()
    .isInt()
    .bail()
    .withMessage('removedby must be an integer!'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];

export const createUser = [
  body('firstname')
    .isString()
    .bail()
    .escape(),
  body('lastname')
    .isString()
    .bail()
    .escape(),
  body('email')
    .isString()
    .bail()
    .isEmail()
    .bail()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];

export const deleteUser = [
  check('userid')
    .trim()
    .isInt()
    .bail()
    .withMessage('userid must be an integer!'),
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

export const addUserToTopic = [
  check('threadid')
    .trim()
    .isInt()
    .bail()
    .withMessage('threadid must be an integer!'),
  check('userid')
    .trim()
    .isInt()
    .bail()
    .withMessage('userid must be an integer!'),
  check('topicid')
    .trim()
    .isInt()
    .bail()
    .withMessage('topicid must be an integer!'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];