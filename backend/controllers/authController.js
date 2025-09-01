// src/controllers/authController.js
import prisma from '../config/database.js';
//console.log(" Prisma import result:", prisma);
import { hashPassword, comparePassword, generateToken } from '../utils/authUtils.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;

    //  Check if user already exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    //  Hash the password
    const hashedPassword = await hashPassword(password);

    //  Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false, // Default to false if not provided
      },
    });

    //  Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    //  Generate token and send response
    res.status(201).json({
      message: 'User registered successfully',
      data: userWithoutPassword,
      token: generateToken(user.id),
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Find the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    //  Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    //  Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    //  Generate token and send response
    res.json({
      message: 'Login successful',
      data: userWithoutPassword,
      token: generateToken(user.id),
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};