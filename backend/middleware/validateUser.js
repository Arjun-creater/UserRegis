import Joi from 'joi';

// Separate schema for updates
const updateUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  age: Joi.number().min(0).max(120).required(),
  dateOfBirth: Joi.date().max('now').required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  about: Joi.string().max(5000).allow('')
});

// Schema for new user registration
const createUserSchema = updateUserSchema.keys({
  password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,}$/).required()
});

export const validateNewUser = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const validateUserUpdate = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};