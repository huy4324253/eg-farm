const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const emailService = require("./email.Service");

class UserService {
  // Get all users
  static async getAllUsers() {
    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      throw new Error("Internal server error");
    }
  }

  // Get single user by ID
  static async getUserById(id) {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      throw new Error("Internal server error");
    }
  }

  // Create a new user
  static async registerUser(
    username,
    email,
    password,
    Phone,
    Address,
    verificationCode
  ) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        verification_code: verificationCode,
        Phone,
        Address,
      });
      return newUser;
    } catch (error) {
      console.error("Error registering user:", error); // Log the error
      throw new Error("Error registering user");
    }
  }

  static async getUserByUsername(username) {
    try {
      const user = await User.findOne({ where: { username } });
      return user;
    } catch (error) {
      throw new Error("Error fetching user by username");
    }
  }
  // Update a user
  static async updateUser(id, username, email) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("User not found");
      }

        await user.update({ username, email });

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Delete a user
  static async deleteUser(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("User not found");
      }
      await user.destroy();
    } catch (error) {
      throw error;
    }
  }

  // Get user by email
  static async getUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return null; // Return null if an error occurs
    }
  }

  // Verify user email
  static async verifyEmail(email, verification_code) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error("User not found");
      }

      if (user.verification_code !== verification_code) {
        return false;
      }

      user.verified = true;
      await user.save();
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Update verification code
  static async updateVerificationCode(email, verificationCode) {
    try {
      const result = await User.update(
        { verification_code: verificationCode },
        { where: { email } }
      );
      if (result[0] === 0) {
        throw new Error("User not found or verification code not updated");
      }
    } catch (error) {
      console.error("Error updating verification code:", error);
      throw new Error("Error updating verification code");
    }
  }

  static async saveResetToken(userId, resetToken) {
    // Save the reset token in the database for the user
    // Example implementation:
    await User.update({ resetToken }, { where: { id: userId } });
  }

  static async getUserIdByResetToken(token) {
    // Retrieve the user ID associated with the reset token
    // Example implementation:
    const user = await User.findOne({ where: { resetToken: token } });
    return user ? user.id : null;
  }

  static async resetUserPassword(userId, newPassword) {
    // Reset user's password
    // Example implementation:
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashedPassword, resetToken: null },
      { where: { id: userId } }
    );
  }

  static async deleteResetToken(userId) {
    // Delete the reset token after password reset
    // Example implementation:
    await User.update({ resetToken: null }, { where: { id: userId } });
  }
  static async updateUserRole(userId, role) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }

      user.role = role;
      await user.save();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
