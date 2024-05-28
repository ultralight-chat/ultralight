import checkAPIs from 'express-validator';
const { body, check, validationResult } = checkAPIs;

export const createMessage  = [
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
  check('createdby')
    .trim()
    .isInt()
    .bail()
    .withMessage('createdby must be an integer!'),
  check('quotedmessageid')
    .optional()
    .trim()
    .isInt()
    .bail()
    .withMessage('quotedmessageid must be an integer!'),
  check('message')
    .optional()
    .isString()
    .bail()
    .withMessage('message must be a string!')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];

export const getMessages = [
  check('messageid')
  .trim()
  .isInt()
  .bail()
  .withMessage('messageid must be an integer!'),
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

export const getAttachment = [
  check('messageid')
    .trim()
    .isInt()
    .bail()
    .withMessage('messageid must be an integer!'),
  check('threadid')
    .trim()
    .isInt()
    .bail()
    .withMessage('threadid must be an integer!'),
  check('attachmentid')
    .trim()
    .isInt()
    .bail()
    .withMessage('attachmentid must be an integer!'),
];

export const deleteMessage = [
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
  check('messageid')
    .trim()
    .isInt()
    .bail()
    .withMessage('messageid must be an integer!'),
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

export const updateMessage = [
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
  check('messageid')
    .trim()
    .isInt()
    .bail()
    .withMessage('messageid must be an integer!'),
  body('message')
    .isString()
    .bail()
    .withMessage('message must be an string!')
    .escape(),
  check('updatedby')
    .trim()
    .isInt()
    .bail()
    .withMessage('updatedby must be an integer!'),
  check('quotedmessageid')
    .optional()
    .trim()
    .isInt()
    .bail()
    .withMessage('quotedmessageid must be an integer!'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];

export const react = [
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
  check('messageid')
    .trim()
    .isInt()
    .bail()
    .withMessage('messageid must be an integer!'),
  check('userid')
    .trim()
    .isInt()
    .bail()
    .withMessage('userid must be an integer!'),
  body('reactiontype')
    .isString()
    .bail()
    .withMessage('reactiontype must be a string!')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];

export const deleteReaction = [
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
  check('messageid')
    .trim()
    .isInt()
    .bail()
    .withMessage('messageid must be an integer!'),
  check('userid')
    .trim()
    .isInt()
    .bail()
    .withMessage('userid must be an integer!'),
  body('reactiontype')
    .isString()
    .bail()
    .withMessage('reactiontype must be a string!')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({errors: errors.array()});
    next();
  }
];

export const addTopic = [
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
  check('topicid')
  .trim()
  .isInt()
  .bail()
  .withMessage('topicid must be an integer!'),
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