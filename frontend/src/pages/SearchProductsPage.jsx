// frontend/src/pages/SearchProductsPage.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Pagination from '../components/Pagination';

const SearchProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedProductType, setSelectedProductType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');

    const limit = 10;

    useEffect(() => {
        fetchProductTypes();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [currentPage, searchKeyword, selectedProductType]); // เมื่อค่าเหล่านี้เปลี่ยน ให้ fetch สินค้าใหม่

    const fetchProducts = async () => {
        setError('');
        try {
            const params = {
                page: currentPage,
                limit: limit,
                search: searchKeyword,
                productTypeId: selectedProductType
            };
            const res = await api.get('/products', { params });
            setProducts(res.data.products);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products.');
            console.error('Search products error:', err);
        }
    };

    const fetchProductTypes = async () => {
        try {
            const res = await api.get('/product-types');
            setProductTypes(res.data);
        } catch (err) {
            console.error('Error fetching product types for search:', err);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page on new search
        fetchProducts();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">ค้นหา สินค้า</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="row g-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="ค้นหาโดยใช้ ชื่อสินค้า หรือ คำอธิบาย"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={selectedProductType}
                            onChange={(e) => setSelectedProductType(e.target.value)}
                        >
                            <option value="">All Product Types</option>
                            {productTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100">Search</button>
                    </div>
                </div>
            </form>

            {products.length === 0 ? (
                <p>No products found matching your criteria.</p>
            ) : (
                <>
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {products.map(product => (
                            <div className="col" key={product.id}>
                                <div className="card h-100">
                                    {product.image_url && (
                                        <img src={product.image_url} className="card-img-top" alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">{product.description}</p>
                                        <p className="card-text"><strong>ราคา:</strong> ${parseFloat(product.price).toFixed(2)}</p>
                                        <p className="card-text"><small className="text-muted">ประเภท: {product.product_type_name || 'N/A'}</small></p>
                                        <p className="card-text"><small className="text-muted">ชื่อผู้ขาย: {product.seller_username || 'N/A'}</small></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchProductsPage;