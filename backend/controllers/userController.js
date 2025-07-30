// backend/controllers/userController.js

const db = require('../config/db');
const bcrypt = require('bcryptjs'); //เพิ่ม bcrypt สำหรับการเข้ารหัสรหัสผ่าน เพิ่มตอน ver.3
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


// @desc    Get all users (for admin panel)
// @route   GET /api/users
// @access  Private/Admin
// (ตัวเลือก: คุณอาจจะต้องการ API ที่ดึงผู้ใช้ทั้งหมดโดยไม่ต้องค้นหา หรือใช้ searchUsers)
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};




// เพิ่มมาตอน ver.3 ระบบจัดการผู้ใช้สำหรับ Admin(เพิ่ม ลบ แก้ไข)


// @desc    Create a new user (by Admin)
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    // Basic validation
    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        // Check if user already exists
        const [existingUsers] = await db.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User with that username or email already exists' });
        }

        // Insert new user
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );
        res.status(201).json({
            message: 'User created successfully',
            userId: result.insertId,
            username,
            email,
            role
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user details (by Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, email, password, role } = req.body;

    let updateFields = [];
    let updateParams = [];

    if (username) {
        updateFields.push('username = ?');
        updateParams.push(username);
    }
    if (email) {
        updateFields.push('email = ?');
        updateParams.push(email);
    }
    if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateFields.push('password = ?');
        updateParams.push(hashedPassword);
    }
    if (role) {
        updateFields.push('role = ?');
        updateParams.push(role);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    try {
        const [result] = await db.query(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            [...updateParams, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(`Error updating user ${userId}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a user (by Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(`Error deleting user ${userId}:`, error);
        res.status(500).json({ message: 'Server error' });
    }
};


