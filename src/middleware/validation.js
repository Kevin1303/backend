const { body, validationResult } = require('express-validator');

exports.validateTodo = [
  body('todo')
    .trim()
    .notEmpty()
    .withMessage('Todo text is required')
    .isLength({ max: 200 })
    .withMessage('Todo cannot be more than 200 characters'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];