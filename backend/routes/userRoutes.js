// backend/routes/userRoutes.js

const express = require('express');
const { searchUsers } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // อาจจะให้ admin เท่านั้นที่ค้นหาได้
const router = express.Router();

router.get('/search', protect, searchUsers); // กำหนดให้ protect และ authorizeRoles('admin') หากต้องการให้เฉพาะ admin ค้นหาได้

module.exports = router;