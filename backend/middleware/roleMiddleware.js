const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'User not found or not authenticated' });
    }
    
    const allowedRoles = roles.map(r => r.toLowerCase());
    const userRole = req.user.userType ? req.user.userType.toLowerCase() : '';

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: `Role ${req.user.userType || 'Unknown'} is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { authorize };
