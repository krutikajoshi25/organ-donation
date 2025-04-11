const isAdmin = (req, res, next) => {
    // Make sure the user is authenticated and has the 'admin' role
    if (req.user && req.user.role === "admin") {
      next(); // Allow access
    } else {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  };
  
  module.exports = isAdmin;
  