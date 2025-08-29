// src/middleware/auth.js
import { verifyToken } from '../utils/authUtils.js';
import prisma from '../config/database.js';

const protect = async (req, res, next) => {
  try {
    let token;

    //  Check for token in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token provided' });
    }

    //  Verify the token
    const decoded = verifyToken(token);

    //  Find the user in the database and attach them to the request object
    // Exclude the password field for security
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, isAdmin: true } // Never send password hash
    });

    if (!user) {
      return res.status(401).json({ error: 'Not authorized, user not found' });
    }

    req.user = user; // Attach user data to the request
    next(); // Proceed to the next middleware/controller

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

// Middleware to check if the user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin rights required.' });
  }
};

export { protect, admin };