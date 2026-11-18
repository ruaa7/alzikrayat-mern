const fs = require('fs');
const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().trim().max(50).required(),
  lastName: Joi.string().trim().max(50).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).max(100).required(),
  location: Joi.string().trim().max(100).allow('').optional(),
  description: Joi.string().trim().max(500).allow('').optional(),
  occupation: Joi.string().trim().max(100).allow('').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

const photoSchema = Joi.object({
  title: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().max(1000).allow('').optional(),
});

const commentSchema = Joi.object({
  comment: Joi.string().trim().max(1000).required(),
});

// middleware that validates req.body against a Joi schema
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    // If a file was already saved by multer remove it 
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    const message = error.details.map((d) => d.message.replace(/"/g, '')).join(', ');
    return res.status(400).json({ message });
  }

  req.body = value; // sanitized values
  next();
};

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validatePhoto: validate(photoSchema),
  validateComment: validate(commentSchema),
};
