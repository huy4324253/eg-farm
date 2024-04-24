const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    // Create a Nodemailer transporter using Gmail
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  // Function to send verification email with a verification code
  async sendVerificationEmail(email, verificationCode) {
    const mailOptions = {
      from: "your_gmail_address@gmail.com",
      to: email,
      subject: "Email Verification",
      text: `Your verification code is: ${verificationCode}. Please enter this code to verify your email address.`,
    };

    try {
      // Send the email
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Verification email sent:", info.messageId);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw error; // Rethrow the error to handle it elsewhere if needed
    }
  }

  // Function to send reset password email
  async sendResetPasswordEmail(email, resetToken) {
    const mailOptions = {
      from: "your_gmail_address@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `To reset your password, click on the following link: localhost:3001/user/reset-password/confirm?token=${resetToken}`,
    };

    try {
      // Send the email
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Reset password email sent:", info.messageId);
    } catch (error) {
      console.error("Error sending reset password email:", error);
      throw error; // Rethrow the error to handle it elsewhere if needed
    }
  }


  // Function to send admin invitation email
  async sendAdminInvitationEmail(email) {
    // Email content
    const mailOptions = {
      from: "your_gmail_address@gmail.com",
      to: email,
      subject: "Admin Invitation",
      text: "You have been invited to become an admin.",
    };

    try {
      // Send the email
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Admin invitation email sent:", info.messageId);
    } catch (error) {
      console.error("Error sending admin invitation email:", error);
      throw error;
    }
  }

}

// Export an instance of the EmailService class
module.exports = new EmailService();
