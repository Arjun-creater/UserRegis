import User from '../models/User.js';
import Joi from 'joi';

// Validation schema for new user
const createUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  age: Joi.number().min(0).max(120).required(),
  dateOfBirth: Joi.date().max('now').required(),
  password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,}$/).required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  about: Joi.string().max(5000).allow('')
});

// Validation schema for updating user
const updateUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  age: Joi.number().min(0).max(120).required(),
  dateOfBirth: Joi.date().max('now').required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  about: Joi.string().max(5000).allow('')
}).options({ stripUnknown: true });

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { error } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await User.findOne({ name: req.body.name });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this name already exists' });
    }

    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { createdAt, updatedAt, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
