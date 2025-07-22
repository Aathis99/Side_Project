// backend/controllers/productTypeController.js

const db = require('../config/db');

// @desc    Get all product types
// @route   GET /api/product-types
// @access  Public
exports.getProductTypes = async (req, res) => {
    try {
        const [types] = await db.query('SELECT * FROM product_types');
        res.json(types);
    } catch (error) {
        console.error('Error fetching product types:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a new product type
// @route   POST /api/product-types
// @access  Private/Admin or Seller
exports.addProductType = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Product type name is required' });
    }

    try {
        const [result] = await db.query('INSERT INTO product_types (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Product type added successfully', id: result.insertId, name });
    } catch (error) {
        console.error('Error adding product type:', error);
        // ตรวจสอบ Unique constraint error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Product type with this name already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a product type
// @route   PUT /api/product-types/:id
// @access  Private/Admin or Seller
exports.updateProductType = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Product type name is required' });
    }

    try {
        const [result] = await db.query('UPDATE product_types SET name = ? WHERE id = ?', [name, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product type not found' });
        }
        res.json({ message: 'Product type updated successfully', id, name });
    } catch (error) {
        console.error('Error updating product type:', error);
         if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Product type with this name already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a product type
// @route   DELETE /api/product-types/:id
// @access  Private/Admin or Seller
exports.deleteProductType = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM product_types WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product type not found' });
        }
        res.json({ message: 'Product type deleted successfully' });
    } catch (error) {
        console.error('Error deleting product type:', error);
        res.status(500).json({ message: 'Server error' });
    }
};