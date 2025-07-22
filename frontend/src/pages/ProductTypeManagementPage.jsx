// frontend/src/pages/ProductTypeManagementPage.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProductTypeManagementPage = () => {
    const [productTypes, setProductTypes] = useState([]);
    const [newTypeName, setNewTypeName] = useState('');
    const [editTypeId, setEditTypeId] = useState(null);
    const [editTypeName, setEditTypeName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProductTypes();
    }, []);

    const fetchProductTypes = async () => {
        try {
            const res = await api.get('/product-types');
            setProductTypes(res.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch product types.');
            console.error('Fetch product types error:', err);
        }
    };

    const handleAddType = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!newTypeName.trim()) {
            setError('Product type name cannot be empty.');
            return;
        }
        try {
            const res = await api.post('/product-types', { name: newTypeName });
            setSuccess(res.data.message);
            setNewTypeName('');
            fetchProductTypes();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add product type.');
            console.error('Add product type error:', err);
        }
    };

    const handleEditClick = (type) => {
        setEditTypeId(type.id);
        setEditTypeName(type.name);
        setError('');
        setSuccess('');
    };

    const handleUpdateType = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!editTypeName.trim()) {
            setError('Product type name cannot be empty.');
            return;
        }
        try {
            const res = await api.put(`/product-types/${editTypeId}`, { name: editTypeName });
            setSuccess(res.data.message);
            setEditTypeId(null); // ออกจากโหมดแก้ไข
            setEditTypeName('');
            fetchProductTypes();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update product type.');
            console.error('Update product type error:', err);
        }
    };

    const handleDeleteType = async (id) => {
        if (window.confirm('Are you sure you want to delete this product type? This might affect products associated with it.')) {
            setError('');
            setSuccess('');
            try {
                const res = await api.delete(`/product-types/${id}`);
                setSuccess(res.data.message);
                fetchProductTypes();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete product type.');
                console.error('Delete product type error:', err);
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">จัดการ ประเภทสินค้า</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="card mb-4">
                <div className="card-header">
                    เพิ่มสินค้าใหม่
                </div>
                <div className="card-body">
                    <form onSubmit={handleAddType}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="ใส่ชื่อ ประเภทสินค้าใหม่"
                                value={newTypeName}
                                onChange={(e) => setNewTypeName(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-primary">เพิ่ม</button>
                        </div>
                    </form>
                </div>
            </div>

            <h3 className="mb-3">ประเภทสินค้าที่มีอยู่</h3>
            {productTypes.length === 0 ? (
                <p>No product types found.</p>
            ) : (
                <ul className="list-group">
                    {productTypes.map(type => (
                        <li key={type.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {editTypeId === type.id ? (
                                <form onSubmit={handleUpdateType} className="w-100 d-flex">
                                    <input
                                        type="text"
                                        className="form-control me-2"
                                        value={editTypeName}
                                        onChange={(e) => setEditTypeName(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="btn btn-success btn-sm me-2">Save</button>
                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditTypeId(null)}>Cancel</button>
                                </form>
                            ) : (
                                <>
                                    <span>{type.name}</span>
                                    <div>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(type)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteType(type.id)}>Delete</button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductTypeManagementPage;