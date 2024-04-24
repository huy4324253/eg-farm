const jwt = require('jsonwebtoken'); // Import jwt directly

// Middleware to authenticate user
exports.auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, 'dzxMsXJ1VktxYs5EB9HaPD');
    req.user = decoded;
    console.log('Authenticated User:', req.user); // Log the authenticated user
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to authorize admin
exports.authAdmin = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    console.log('User not authenticated.');
    return res.status(401).json({ error: 'Unauthorized' }); // User is not authenticated, return unauthorized error
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, 'dzxMsXJ1VktxYs5EB9HaPD');
    req.user = decoded;
    console.log('Authenticated Admin:', req.user); // Log the authenticated admin
    if (req.user.role === 1) {
      next(); // User is admin, proceed to next middleware
    } else {
      return res.status(403).json({ error: 'Forbidden' }); // User role is not 1, return forbidden error
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
