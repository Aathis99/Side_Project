// backend/controllers/productController.js

const db = require('../config/db');

// @desc    Get all products (with optional search and pagination)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    const { search, productTypeId, page = 1, limit = 10 } = req.query; // เพิ่ม page และ limit สำหรับ pagination
    const offset = (page - 1) * limit;

    // แก้ไข: เพิ่ม alias 'p' ให้กับ 'products' ใน countQuery ด้วย
    let query = 'SELECT p.*, pt.name AS product_type_name, u.username AS seller_username FROM products p LEFT JOIN product_types pt ON p.product_type_id = pt.id LEFT JOIN users u ON p.seller_id = u.id';
    let countQuery = 'SELECT COUNT(*) AS total FROM products p'; // ✨ แก้ไขตรงนี้: เพิ่ม ' p'
    const params = [];
    const countParams = [];

    const conditions = [];

    if (search) {
        conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
        countParams.push(`%${search}%`, `%${search}%`);
    }

    if (productTypeId) {
        conditions.push('p.product_type_id = ?');
        params.push(productTypeId);
        countParams.push(productTypeId);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
        countQuery += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY p.id DESC LIMIT ? OFFSET ?`; // เพิ่ม ORDER BY เพื่อให้ผลลัพธ์มีลำดับที่แน่นอน
    params.push(parseInt(limit), parseInt(offset));

    try {
        const [products] = await db.query(query, params);
        const [totalResult] = await db.query(countQuery, countParams);
        const totalProducts = totalResult[0].total;

        res.json({
            products,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const [products] = await db.query('SELECT p.*, pt.name AS product_type_name, u.username AS seller_username FROM products p LEFT JOIN product_types pt ON p.product_type_id = pt.id LEFT JOIN users u ON p.seller_id = u.id WHERE p.id = ?', [id]);
        const product = products[0];
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a new product
// @route   POST /api/products
// @access  Private/Seller
exports.addProduct = async (req, res) => {
    const { name, description, price, product_type_id, image_url } = req.body;
    const seller_id = req.user.id; // ดึง seller_id จาก token

    if (!name || !price || !product_type_id) {
        return res.status(400).json({ message: 'Name, price, and product type are required' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, product_type_id, seller_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, product_type_id, seller_id, image_url]
        );
        res.status(201).json({ message: 'Product added successfully', id: result.insertId, name, description, price, product_type_id, seller_id, image_url });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller (only owner can update)
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, product_type_id, image_url } = req.body;
    const seller_id = req.user.id; // ID ของผู้ใช้ที่กำลัง login

    try {
        // ตรวจสอบว่าสินค้าเป็นของผู้ขายคนนี้หรือไม่
        const [products] = await db.query('SELECT seller_id FROM products WHERE id = ?', [id]);
        const product = products[0];

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        //แก้ตรงนี้ให้ admin สามารถอัพเดทได้ ใส่ && req.user.role !== 'admin'
        if (product.seller_id !== seller_id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        const [result] = await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, product_type_id = ?, image_url = ? WHERE id = ?',
            [name, description, price, product_type_id, image_url, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully', id, name, description, price, product_type_id, image_url });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller (only owner can delete)
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    const seller_id = req.user.id; // ID ของผู้ใช้ที่กำลัง login

    try {
        // ตรวจสอบว่าสินค้าเป็นของผู้ขายคนนี้หรือไม่
        const [products] = await db.query('SELECT seller_id FROM products WHERE id = ?', [id]);
        const product = products[0];

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        //แก้ตรงนี้ให้ admin สามารถอัพเดทได้
        if (product.seller_id !== seller_id && req.user.role !== 'admin')  {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};