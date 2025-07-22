// frontend/src/pages/ProductManagementPage.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Pagination from '../components/Pagination';

const ProductManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [productForm, setProductForm] = useState({
        id: null,
        name: '',
        description: '',
        price: '',
        product_type_id: '',
        image_url: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const limit = 10; // จำนวนสินค้าต่อหน้า

    useEffect(() => {
        fetchProducts(currentPage);
        fetchProductTypes();
    }, [currentPage]); // เมื่อ currentPage เปลี่ยน, fetch Products ใหม่

    const fetchProducts = async (page) => {
        try {
            const res = await api.get(`/products?page=${page}&limit=${limit}`);
            setProducts(res.data.products);
            setTotalPages(res.data.totalPages);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products.');
            console.error('Fetch products error:', err);
        }
    };

    const fetchProductTypes = async () => {
        try {
            const res = await api.get('/product-types');
            setProductTypes(res.data);
        } catch (err) {
            console.error('Error fetching product types for form:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductForm({ ...productForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!productForm.name || !productForm.price || !productForm.product_type_id) {
            setError('Name, Price, and Product Type are required.');
            return;
        }

        try {
            if (productForm.id) {
                // Update product
                const res = await api.put(`/products/${productForm.id}`, productForm);
                setSuccess(res.data.message);
            } else {
                // Add new product
                const res = await api.post('/products', productForm);
                setSuccess(res.data.message);
            }
            // Clear form and re-fetch products
            setProductForm({ id: null, name: '', description: '', price: '', product_type_id: '', image_url: '' });
            fetchProducts(currentPage);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product.');
            console.error('Save product error:', err);
        }
    };

    const handleEditClick = (product) => {
        setProductForm({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            product_type_id: product.product_type_id,
            image_url: product.image_url || ''
        });
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setError('');
            setSuccess('');
            try {
                const res = await api.delete(`/products/${id}`);
                setSuccess(res.data.message);
                fetchProducts(currentPage);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete product.');
                console.error('Delete product error:', err);
            }
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">จัดการ สินค้า</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="card mb-4">
                <div className="card-header">
                    {productForm.id ? 'จัดการสินค้า' : 'เพิ่มสินค้าใหม่'}
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">ชื่อสินค้า</label>
                            <input type="text" className="form-control" id="name" name="name" value={productForm.name} onChange={handleInputChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">คำอธิบาย</label>
                            <textarea className="form-control" id="description" name="description" value={productForm.description} onChange={handleInputChange} rows="3"></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">ราคา</label>
                            <input type="number" className="form-control" id="price" name="price" value={productForm.price} onChange={handleInputChange} step="0.01" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="product_type_id" className="form-label">ประเภทสินค้า</label>
                            <select className="form-select" id="product_type_id" name="product_type_id" value={productForm.product_type_id} onChange={handleInputChange} required>
                                <option value="">เลือก ประเภทสินค้า</option>
                                {productTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image_url" className="form-label">Image URL</label>
                            <input type="text" className="form-control" id="image_url" name="image_url" value={productForm.image_url} onChange={handleInputChange} />
                        </div>
                        <button type="submit" className="btn btn-primary me-2">{productForm.id ? 'อัพเดทสินค้า' : 'เพิ่มสินค้า'}</button>
                        {productForm.id && (
                            <button type="button" className="btn btn-secondary" onClick={() => setProductForm({ id: null, name: '', description: '', price: '', product_type_id: '', image_url: '' })}>
                                ยกเลิก
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <h3 className="mb-3">เลือก สินค้าทั้งหมด</h3>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ภาพ</th>
                                <th>ชื่อ</th>
                                <th>คำอธิบาย</th>
                                <th>ราคา</th>
                                <th>ประเภท</th>
                                <th>ชื่อผู้ขาย</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>
                                        {product.image_url && (
                                            <img src={product.image_url} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                        )}
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>${parseFloat(product.price).toFixed(2)}</td>
                                    <td>{product.product_type_name || 'N/A'}</td>
                                    <td>{product.seller_username || 'N/A'}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(product)}>แก้ไข</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}>ลบ</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
};

export default ProductManagementPage;