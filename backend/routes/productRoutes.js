// backend/routes/productRoutes.js

const express = require('express');
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getProducts); // ค้นหาและแสดงสินค้าทั้งหมด (public)
router.get('/:id', getProductById); // แสดงสินค้ารายชิ้น (public)

router.post('/', protect, authorizeRoles('seller','admin' ), addProduct); // เพิ่มสินค้า (สำหรับ seller เท่านั้น)
router.put('/:id', protect, authorizeRoles('seller','admin'), updateProduct); // แก้ไขสินค้า (สำหรับ seller ที่เป็นเจ้าของเท่านั้น)
router.delete('/:id', protect, authorizeRoles('seller','admin'), deleteProduct); // ลบสินค้า (สำหรับ seller ที่เป็นเจ้าของเท่านั้น)

module.exports = router;