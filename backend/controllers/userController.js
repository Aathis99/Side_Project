// backend/controllers/userController.js

const db = require('../config/db');

// @desc    Search users by username or email
// @route   GET /api/users/search
// @access  Private/Admin (หรือใครก็ได้ที่ได้รับอนุญาตให้ค้นหา)
exports.searchUsers = async (req, res) => {
    const { keyword, role, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, username, email, role, created_at FROM users';
    let countQuery = 'SELECT COUNT(*) AS total FROM users';
    const params = [];
    const countParams = [];
    const conditions = [];

    if (keyword) {
        conditions.push('(username LIKE ? OR email LIKE ?)');
        params.push(`%${keyword}%`, `%${keyword}%`);
        countParams.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (role) {
        conditions.push('role = ?');
        params.push(role);
        countParams.push(role);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
        countQuery += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    try {
        const [users] = await db.query(query, params);
        const [totalResult] = await db.query(countQuery, countParams);
        const totalUsers = totalResult[0].total;

        res.json({
            users,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers
        });
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


