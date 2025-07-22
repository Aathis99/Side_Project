// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// @desc    Protect routes
exports.protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // ดึง token ออกจาก Header
            token = req.headers.authorization.split(' ')[1];

            // ตรวจสอบ token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // เพิ่ม user และ role เข้าไปใน req object
            req.user = decoded;
            next(); // ไปยัง middleware หรือ route ถัดไป
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Authorize roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
        }
        next();
    };
};