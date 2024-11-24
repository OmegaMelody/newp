const Router = require('express');
const { check, validationResult } = require('express-validator'); // Додано імпорт check
const router = new Router();
const { googleAuth } = require('../controllers/auth');

// Middleware for validation error handling
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Google OAuth route with validation
router.get(
    '/google',
    [
        check('redirect_uri')
            .optional()
            .isURL()
            .withMessage('Invalid redirect URI'),
    ],
    validateRequest,
    googleAuth
);

module.exports = router;
