// backend/routes/productTypeRoutes.js

const express = require('express');
const { getProductTypes, addProductType, updateProductType, deleteProductType } = require('../controllers/productTypeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getProductTypes);
router.post('/', protect, authorizeRoles('seller'), addProductType); // ต้องเป็น seller ถึงจะเพิ่มประเภทสินค้าได้
router.put('/:id', protect, authorizeRoles('seller'), updateProductType); // ต้องเป็น seller ถึงจะแก้ไขประเภทสินค้าได้
router.delete('/:id', protect, authorizeRoles('seller'), deleteProductType); // ต้องเป็น seller ถึงจะลบประเภทสินค้าได้

module.exports = router;