// frontend/src/pages/SearchUsersPage.js

import React, { useState, useEffect } from "react";
import api from "../services/api";
import Pagination from "../components/Pagination";

// Component สำหรับฟอร์มเพิ่ม/แก้ไขผู้ใช้ (จะสร้างแยกเป็นไฟล์ UserForm.jsx ทีหลัง หรือจะรวมไว้ในนี้ก็ได้)
// เพื่อให้โค้ด SearchUsersPage ไม่ยาวเกินไป เราจะใช้ Modal และฟอร์มชั่วคราวไว้ในนี้ก่อน
const UserFormModal = ({ show, onClose, onSubmit, userData, mode, error }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer", // Default role for new users
  });

  useEffect(() => {
    if (mode === "edit" && userData) {
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        password: "", // ไม่ควรแสดง password เดิมในฟอร์มแก้ไข
        role: userData.role || "customer",
      });
    } else {
      // Reset form for 'add' mode or when modal closes
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "customer",
      });
    }
  }, [show, userData, mode]); // Reset form when modal shows/hides or mode/userData changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!show) {
    return null;
  }

  return (
    <div
      className="modal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "เพิ่มผู้ใช้ใหม่" : "แก้ไขข้อมูลผู้ใช้"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={mode === "edit"} // Username มักจะไม่ถูกแก้ไข
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  {mode === "add"
                    ? "รหัสผ่าน"
                    : "รหัสผ่านใหม่ (หากต้องการเปลี่ยน)"}
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  {...(mode === "add" && { required: true })} // Password required only for adding
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  ตำแหน่ง
                </label>
                <select
                  className="form-select"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                ยกเลิก
              </button>
              <button type="submit" className="btn btn-primary">
                {mode === "add" ? "เพิ่มผู้ใช้" : "บันทึกการแก้ไข"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SearchUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New: Loading state

  // States for User Form Modal
  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null); // Data for editing
  const [formMode, setFormMode] = useState("add"); // 'add' or 'edit'
  const [formError, setFormError] = useState(""); // Error for form submission

  const limit = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchKeyword, selectedRole]);

  const fetchUsers = async () => {
    setError("");
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: limit,
        keyword: searchKeyword,
        role: selectedRole,
      };
      const res = await api.get("/users/search", { params }); // ใช้ '/users/search' เหมือนเดิม
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch users. You might not have permission."
      );
      console.error("Search users error:", err);
    } finally {
      setLoading(false);
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

  // --- New Functions for User Management ---

  const handleAddUserClick = () => {
    setFormMode("add");
    setCurrentUserData(null);
    setFormError("");
    setShowUserFormModal(true);
  };

  const handleEditUserClick = (user) => {
    setFormMode("edit");
    setCurrentUserData(user);
    setFormError("");
    setShowUserFormModal(true);
  };

  const handleDeleteUserClick = async (userId) => {
    if (window.confirm("คุณแน่ใจหรือไม่ที่ต้องการลบผู้ใช้รายนี้?")) {
      setLoading(true);
      try {
        await api.delete(`/users/${userId}`);
        alert("ผู้ใช้ถูกลบเรียบร้อยแล้ว!");
        fetchUsers(); // Refresh the list
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete user.");
        console.error("Delete user error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUserFormSubmit = async (formData) => {
    setFormError("");
    setLoading(true);
    try {
      if (formMode === "add") {
        await api.post("/users", formData); // API for creating user
        alert("เพิ่มผู้ใช้ใหม่เรียบร้อยแล้ว!");
      } else if (formMode === "edit") {
        // สำหรับการแก้ไข, เราอาจส่งข้อมูลเฉพาะที่เปลี่ยนไป
        // ในที่นี้จะส่งทั้งหมด (ยกเว้น username ถ้าไม่อนุญาตให้เปลี่ยน)
        const updateData = { ...formData };
        if (currentUserData?.username) {
          delete updateData.username; // ไม่ส่ง username ไปถ้ากำลังแก้ไข
        }
        if (!updateData.password) {
          delete updateData.password; // ถ้า password เป็นค่าว่าง, ไม่ต้องส่งไปอัปเดต
        }

        await api.put(`/users/${currentUserData.id}`, updateData); // API for updating user
        alert("แก้ไขข้อมูลผู้ใช้เรียบร้อยแล้ว!");
      }
      setShowUserFormModal(false); // Close modal
      fetchUsers(); // Refresh the list
    } catch (err) {
      setFormError(
        err.response?.data?.message || `Failed to ${formMode} user.`
      );
      console.error(`${formMode} user error:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">ค้นหา & จัดการ ผู้ใช้</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">กำลังโหลด...</div>}

      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="ค้นหาโดยใช้ ชื่อผู้ใช้ หรือ email"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">ทุกตำแหน่ง</option>{" "}
              {/* เปลี่ยน All Roles เป็น ทุกตำแหน่ง */}
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option> {/* เพิ่ม Admin Role */}
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">
              ค้นหา
            </button>
          </div>
          <div className="col-md-3">
            <button
              type="button"
              className="btn btn-success w-100"
              onClick={handleAddUserClick}
            >
              เพิ่มผู้ใช้ใหม่
            </button>
          </div>
        </div>
      </form>

      {users.length === 0 && !loading ? (
        <p className="text-center">
          ไม่พบผู้ใช้ที่ตรงตามเงื่อนไข หรือคุณไม่มีสิทธิ์ดูผู้ใช้
        </p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ชื่อผู้ใช้</th>
                  <th>Email</th>
                  <th>ตำแหน่ง</th>
                  <th>สมัคร ณ วันที่</th>
                  <th>การจัดการ</th> {/* New: Actions Column */}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {new Date(user.created_at).toLocaleDateString("th-TH")}
                    </td>{" "}
                    {/* Format date for Thai locale */}
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEditUserClick(user)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUserClick(user.id)}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      {/* User Form Modal */}
      <UserFormModal
        show={showUserFormModal}
        onClose={() => setShowUserFormModal(false)}
        onSubmit={handleUserFormSubmit}
        userData={currentUserData}
        mode={formMode}
        error={formError}
      />
    </div>
  );
};

export default SearchUsersPage;
