const userService = require("../services/User.service");
const emailService = require("../services/email.Service");
const UserValidation = require("../validation/user.validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const ResponseHandler = require("../utils/handleRes.util");
const userValidation = new UserValidation();

class UserController {
  constructor() {
    this.blacklist = [];
  }
  static async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      ResponseHandler.handleResponse(res, users);
    } catch (error) {
      ResponseHandler.handleResponse(res, error, 500);
    }
  }

  static async getUserById(req, res) {
    const { id } = req.params;
    try {
      const user = await userService.getUserById(id);
      if (!user) {
        ResponseHandler.handleResponse(res, { message: "User not found" }, 404);
      } else {
        ResponseHandler.handleResponse(res, user);
      }
    } catch (error) {
      ResponseHandler.handleResponse(res, error, 500);
    }
  }

  static async register(req, res) {
    const { error } = userValidation.validateRegistration(req.body);
    if (error) {
      ResponseHandler.handleResponse(
        res,
        { error: error.details[0].message },
        400
      );
      return;
    }

    const { username, email, password, Phone, Address, requestNewCode } =
      req.body;
    try {
      const existingUser = await userService.getUserByEmail(email);
      let user;
      let verificationCode;

      if (!existingUser || !existingUser.verified || requestNewCode) {
        // Generate a new verification code if it's a new user or requestNewCode is true
        verificationCode = UserController.generateNewVerificationCode();
        // Register the user or update verification code if it's a new user or requestNewCode is true
        user = await userService.registerUser(
          username,
          email,
          password,
          Phone,
          Address,
          verificationCode
        );
      } else {
        // Use the existing verification code if user exists and not requesting a new code
        verificationCode = existingUser.verification_code;
      }

      // Send verification email only once, outside of the conditional block
      if (!existingUser || !existingUser.verified || requestNewCode) {
        await emailService.sendVerificationEmail(email, verificationCode);
      }

      ResponseHandler.handleResponse(res, { newUser: user }, 201);
    } catch (error) {
      console.error("Error registering user:", error); // Log the error
      ResponseHandler.handleResponse(res, error, 400);
    }
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const { username, email } = req.body;
    try {
      const user = await userService.updateUser(id, username, email);
      ResponseHandler.handleResponse(res, user);
    } catch (error) {
      ResponseHandler.handleResponse(res, error, 400);
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;
    try {
      await userService.deleteUser(id);
      ResponseHandler.handleResponse(res, {
        message: "User deleted successfully",
      });
    } catch (error) {
      ResponseHandler.handleResponse(res, error, 500);
    }
  }

  static async login(req, res) {
    const { error } = userValidation.validateLogin(req.body);
    if (error) {
      ResponseHandler.handleResponse(
        res,
        { error: error.details[0].message },
        400
      );
      return;
    }

    const { username, password } = req.body;

    try {
      const user = await userService.getUserByUsername(username);
      if (!user) {
        ResponseHandler.handleResponse(res, { error: "User not found" }, 404);
        return;
      }

      // Check if the user is verified
      if (!user.verified) {
        ResponseHandler.handleResponse(
          res,
          { error: "Please verify your email address to log in" },
          403
        );
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        ResponseHandler.handleResponse(
          res,
          { error: "Invalid username or password" },
          401
        );
        return;
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        "dzxMsXJ1VktxYs5EB9HaPD",
        { expiresIn: "1d" }
      );
      res.json({ token });

      // Remove this line to prevent sending the verification email twice
      // emailService.sendVerificationEmail(user.email);
    } catch (error) {
      console.error(error);
      ResponseHandler.handleResponse(
        res,
        { error: "Internal server error" },
        500
      );
    }
  }

  static async logout(req, res) {
    const userController = new UserController(); // Create an instance of UserController
    const token = req.headers.authorization;

    if (!token) {
      ResponseHandler.handleResponse(res, { error: "Unauthorized" }, 401);
      return;
    }

    userController.blacklist.push(token); // Accessing blacklist through the instance

    ResponseHandler.handleResponse(res, { message: "Logout successful" });
  }

  static checkTokenBlacklist(req, res, next) {
    const userController = new UserController(); // Create an instance of UserController
    const token = req.headers.authorization;

    if (userController.blacklist.includes(token)) {
      // Accessing blacklist through the instance
      ResponseHandler.handleResponse(
        res,
        { error: "Token revoked. Please log in again." },
        401
      );
      return;
    }

    next();
  }

  static async verifyEmail(req, res) {
    try {
      const { error } = userValidation.validateVerification(req.body);
      if (error) {
        ResponseHandler.handleResponse(
          res,
          { error: error.details[0].message },
          400
        );
        return;
      }

      const { email, verification_code } = req.body;
      console.log("Request body:", req.body);

      try {
        const isVerified = await userService.verifyEmail(
          email,
          verification_code
        );
        if (isVerified) {
          ResponseHandler.handleResponse(res, {
            message: "Email verified successfully",
          });
        } else {
          ResponseHandler.handleResponse(
            res,
            { error: "Invalid verification code" },
            400
          );
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        ResponseHandler.handleResponse(
          res,
          { error: "Internal server error" },
          500
        );
      }
    } catch (error) {
      console.error("Error in verifyEmail handler:", error);
      ResponseHandler.handleResponse(
        res,
        { error: "Internal server error" },
        500
      );
    }
  }

  static async resendVerificationEmail(req, res) {
    const { email } = req.body;
    try {
      const verificationCode = UserController.generateNewVerificationCode();
      await userService.updateVerificationCode(email, verificationCode);
      await emailService.sendVerificationEmail(email, verificationCode);
      ResponseHandler.handleResponse(res, {
        message: "Verification email sent successfully",
      });
    } catch (error) {
      ResponseHandler.handleResponse(res, { error: error.message }, 400);
    }
  }

  static generateNewVerificationCode() {
    // Generate a new random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    return verificationCode.toString(); // Convert to string
  }
  static async initiateReset(req, res) {
    const { email } = req.body;
    try {
      // Validate email
      const { error: emailError } = userValidation.validateEmail(email);
      if (emailError) {
        ResponseHandler.handleResponse(
          res,
          { error: emailError.details[0].message },
          400
        );
        return;
      }

      console.log("Initiating password reset for email:", email);

      const user = await userService.getUserByEmail(email);
      if (!user) {
        console.log("User not found");
        ResponseHandler.handleResponse(res, { error: "User not found" }, 404);
        return;
      }

      // Generate a reset token using JWT
      const resetToken = jwt.sign(
        { userId: user.id },
        process.env.RESET_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      console.log("Generated reset token:", resetToken);

      // Save the reset token in the database or send it via email
      await userService.saveResetToken(user.id, resetToken);
      console.log("Reset token saved for user:", user.id);

      // Send reset instructions to the user's email
      await emailService.sendResetPasswordEmail(email, resetToken);
      console.log("Reset instructions email sent to:", email);

      ResponseHandler.handleResponse(res, {
        message: "Reset instructions sent successfully",
      });
    } catch (error) {
      console.error("Error initiating password reset:", error);
      ResponseHandler.handleResponse(
        res,
        { error: "Internal server error" },
        500
      );
    }
  }
  static async resetPassword(req, res) {
    const { token } = req.query;
    const { newPassword } = req.body;
    try {
      // Validate newPassword
      if (!newPassword) {
        ResponseHandler.handleResponse(
          res,
          { error: "New password is required" },
          400
        );
        return;
      }

      console.log("Resetting password with token:", token);

      // Verify the reset token
      const decodedToken = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
      console.log("Decoded reset token:", decodedToken);

      const userId = decodedToken.userId;
      console.log("User ID extracted from token:", userId);

      // Reset user's password
      await userService.resetUserPassword(userId, newPassword);
      console.log("Password reset successfully for user:", userId);

      // Optionally, delete the reset token after password reset
      await userService.deleteResetToken(userId);
      console.log("Reset token deleted for user:", userId);

      ResponseHandler.handleResponse(res, {
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      ResponseHandler.handleResponse(
        res,
        { error: "Invalid or expired reset token" },
        400
      );
    }
  }
  static async inviteAsAdmin(req, res) {
    try {
      // Retrieve the user to be invited
      const { email } = req.body;
      const userToInvite = await userService.getUserByEmail(email);
      if (!userToInvite) {
        return ResponseHandler.handleResponse(
          res,
          { error: "User not found" },
          404
        );
      }

      // Check if the user is already an admin
      if (userToInvite.role === 1) {
        return ResponseHandler.handleResponse(
          res,
          { error: "User is already an admin" },
          400
        );
      }

      // Update the user's role to make them an admin
      await userService.updateUserRole(userToInvite.id, 1);

      // Send a notification or email to the user
      await emailService.sendAdminInvitationEmail(userToInvite.email);

      return ResponseHandler.handleResponse(res, {
        message: "User invited as admin",
      });
    } catch (error) {
      console.error("Error inviting user as admin:", error);
      return ResponseHandler.handleResponse(
        res,
        { error: "Internal server error" },
        500
      );
    }
  }
  static async authenticate(req, res) {
    try {
      console.log('Starting Google authentication process...');
      
      const oauth2Client = new OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
      });

      res.redirect(authUrl);
    } catch (error) {
      console.error('Error authenticating with Google:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    try {
        console.log('Starting Google authentication process...');
        // Log the authorization code received in the callback URL
        console.log('Authorization code:', req.query.code);
        // Rest of the authentication code
    } catch (error) {
        console.error('Error authenticating with Google:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async callback(req, res) {
    try {
      console.log('Handling Google callback...');
      
      const oauth2Client = new OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      const { code } = req.query;
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const userInfo = await oauth2.userinfo.get();

      // Handle user info as needed (e.g., save to database, authenticate user, etc.)
      res.json(userInfo.data);
    } catch (error) {
      console.error('Error handling Google callback:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UserController;
