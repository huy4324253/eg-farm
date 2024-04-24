const Joi = require('joi');

class UserValidation {
  constructor() {}

  validateRegistration(data) {
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).required(),
        Phone: Joi.string().required(), // Add Phone validation
        Address: Joi.string().required(), // Add Address validation
    });
    return schema.validate(data);
}

  validateLogin(data) {
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    });
    return schema.validate(data);
  }

  validateEmail(email) {
    const schema = Joi.string().email().required();
    if (typeof email === 'string') {
      return schema.validate(email);
    } else {
      return { error: '\"value\" must be a string' };
    }
  }

  validateVerification(data) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      verification_code: Joi.string().required().pattern(/^\d{6}$/)
    });
    return schema.validate(data);
  }
}

module.exports = UserValidation;
