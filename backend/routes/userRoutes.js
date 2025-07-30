// backend/routes/userRoutes.js

const express = require('express');

//เพิ่ม การทำงานร่วม createUser, updateUser, deleteUser, getAllUsers ใน ver.3
const { searchUsers, createUser, updateUser, deleteUser, getAllUsers  } = require('../controllers/userController');

const { protect, authorizeRoles} = require('../middleware/authMiddleware'); // อาจจะให้ admin เท่านั้นที่ค้นหาได้
const router = express.Router();

router.get('/search', protect, searchUsers); // กำหนดให้ protect และ authorizeRoles('admin') หากต้องการให้เฉพาะ admin ค้นหาได้

router.get('/', protect, authorizeRoles('admin'), getAllUsers); // ดึงผู้ใช้ทั้งหมด
router.post('/', protect, authorizeRoles('admin'), createUser); // สร้างผู้ใช้ใหม่
router.put('/:id', protect, authorizeRoles('admin'), updateUser); // อัปเดตผู้ใช้
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser); // ลบผู้ใช้

module.exports = router;