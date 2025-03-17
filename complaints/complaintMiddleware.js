const jwt = require('jsonwebtoken');

// Authentication Middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Includes id and role
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Authorization Middleware for SubAdmins
const isSubAdmin = (req, res, next) => {
  if (req.user.role !== 'SubAdmin') {
    return res.status(403).json({ message: 'Access denied: SubAdmins only' });
  }
  next();
};

module.exports = { auth, isSubAdmin };
