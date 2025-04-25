// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//     const authHeader = req.header("Authorization");

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "Access denied. No token provided." });
//     }

//     const token = authHeader.split(" ")[1]; // Extract the actual token

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // Attach user data to request
//         next(); // Proceed to next middleware/controller
//     } catch (error) {
//         res.status(400).json({ message: "Invalid token." });
//     }
// };

// module.exports = authMiddleware;










const jwt = require("jsonwebtoken");
const generateToken = (user) => {
    const payload = {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

console.log("Decoded token:", decoded); // 👈 Add this

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }); // Token expires in 7 days
    return token;
};
const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract the actual token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Log the decoded token to check its content
        console.log(decoded);

        req.user = decoded; // Attach user data to request
        next(); // Proceed to next middleware/controller
    } catch (error) {
        console.error("Invalid token:", error);

        if (error.name === 'TokenExpiredError') {
            // Convert expiration time to human-readable format
            const expDate = new Date(error.expiredAt); // Convert from seconds to milliseconds
            console.log("Token expired at:", expDate.toLocaleString()); // Log the expiration date

            return res.status(401).json({
                message: `Token expired at ${expDate.toLocaleString()}. Please log in again.`
            });
        }

        // For any other JWT verification error
        res.status(400).json({ message: "Invalid token. Please try again." });
    }
};


module.exports = authMiddleware;

