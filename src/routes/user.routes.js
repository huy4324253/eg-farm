const express = require('express');
const router = express.Router();
const userController = require('../Controller/user.controller');
const { auth,authAdmin } = require('../utils/auth'); // Import auth middleware

// Routes that don't require authentication

// POST create a new user
router.post('/register', userController.register);

// Route for user login
router.post('/login', userController.login);

// Route for verifying email
router.post('/verify', userController.verifyEmail);

// Route for resending verification email
router.post('/resend-verification', userController.resendVerificationEmail);

// Route for initiating password reset
router.post('/reset-password', userController.initiateReset);

// Route for resetting password
router.post('/reset-password/confirm', userController.resetPassword);

// Routes that require authentication
router.use(auth);

// GET single user by ID
router.get('/:id', userController.getUserById);

// PUT update a user by ID
router.put('/:id', userController.updateUser);

// DELETE delete a user by ID
router.delete('/:id', userController.deleteUser);

// Route for user logout
router.post('/logout', userController.logout);

router.use(authAdmin);

router.post('/admin', userController.inviteAsAdmin);
// GET all users
router.get('/', userController.getAllUsers);

router.get('/authenticate', userController.authenticate);

// Route for handling Google OAuth callback
router.get('/callback', userController.callback);

module.exports = router;
