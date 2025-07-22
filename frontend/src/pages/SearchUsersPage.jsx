// frontend/src/pages/SearchUsersPage.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Pagination from '../components/Pagination';

const SearchUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');

    const limit = 10;

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchKeyword, selectedRole]);

    const fetchUsers = async () => {
        setError('');
        try {
            const params = {
                page: currentPage,
                limit: limit,
                keyword: searchKeyword,
                role: selectedRole
            };
            const res = await api.get('/users/search', { params });
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users. You might not have permission.');
            console.error('Search users error:', err);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page on new search
        fetchUsers();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">ค้นหา ผู้ใช้</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="row g-3">
                    <div className="col-md-5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="ค้นหาโดยใช้ ชื่อผู้ใช้ หรือ email"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="customer">Customer</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <button type="submit" className="btn btn-primary w-100">Search</button>
                    </div>
                </div>
            </form>

            {users.length === 0 ? (
                <p>No users found matching your criteria or you do not have permission to view users.</p>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>ตำแหน่ง</th>
                                    <th>สมัค ณ วันที่</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchUsersPage;