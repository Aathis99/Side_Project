// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // ต้องมี path ไปยังไฟล์ db config ของคุณ

// @desc    Protect routes - ตรวจสอบ JWT และดึงข้อมูล User จาก DB
exports.protect = async (req, res, next) => { // <--- ต้องเป็น async function
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // ดึง token ออกจาก Header
            token = req.headers.authorization.split(' ')[1];

            // ตรวจสอบ token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // *** ส่วนที่สำคัญ: ดึงข้อมูลผู้ใช้จากฐานข้อมูลด้วย ID ที่ได้จาก Token ***
            // เพื่อให้มั่นใจว่าข้อมูลผู้ใช้ (รวมถึง Role) เป็นข้อมูลล่าสุดและถูกต้องจาก DB
            const [users] = await db.query('SELECT id, username, email, role FROM users WHERE id = ?', [decoded.id]);

            if (users.length === 0) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = users[0]; // เก็บข้อมูล user (รวมถึง role) ไว้ใน req
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

// @desc    Authorize roles - ตรวจสอบว่า req.user.role มีอยู่ใน roles ที่อนุญาตหรือไม่
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // ตรวจสอบว่า req.user ถูกตั้งค่าและมี role หรือไม่
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Not authorized, user role not found or not logged in' });
        }
        // ตรวจสอบว่า role ของผู้ใช้มีอยู่ใน roles ที่กำหนดไว้หรือไม่
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
        }
        next();
    };
};