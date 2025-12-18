const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from Authorization header
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.substring(7);
    console.log('Token from Authorization header:', token ? 'Found' : 'Not found');
  }

  if (!token) {
    console.log('No token found in cookies or Authorization header');
    return res.status(401).json({ message: 'Not authorized, no token found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully for user:', decoded.id);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ message: 'Token is not valid: ' + error.message });
  }
};

module.exports = { authMiddleware };
