import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../styles/admins.css";

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin"
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/admin/admins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch admins");

      const data = await response.json();
      setAdmins(data.admins || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    if (!editingAdmin && !formData.password) {
      toast.error("Password is required for new admin");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const url = editingAdmin
        ? `http://localhost:5000/api/admin/admins/${editingAdmin._id}`
        : "http://localhost:5000/api/admin/admins";
      
      const method = editingAdmin ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save admin");
      }

      toast.success(editingAdmin ? "Admin updated!" : "Admin created!");
      setShowModal(false);
      setEditingAdmin(null);
      setFormData({ name: "", email: "", password: "", role: "admin" });
      fetchAdmins();
    } catch (error) {
      console.error("Error saving admin:", error);
      toast.error(error.message);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role
    });
    setShowModal(true);
  };

  const handleDelete = async (adminId) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/admin/admins/${adminId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete admin");

      toast.success("Admin deleted!");
      fetchAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Failed to delete admin");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAdmin(null);
    setFormData({ name: "", email: "", password: "", role: "admin" });
  };

  if (loading) {
    return <div className="loading">Loading admins...</div>;
  }

  return (
    <div className="admins-page">
      <div className="page-header">
        <div>
          <h1>Admins</h1>
          <p>Manage admin users</p>
        </div>
        <button className="btn-add" onClick={() => setShowModal(true)}>
          Add Admin
        </button>
      </div>

      <div className="admins-stats">
        <div className="stat-item">
          <span className="stat-label">Admins</span>
          <span className="stat-value">{admins.filter(a => a.role === "admin").length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Super Admins</span>
          <span className="stat-value">{admins.filter(a => a.role === "super_admin").length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total</span>
          <span className="stat-value">{admins.length}</span>
        </div>
      </div>

      <div className="admins-list">
        {admins.length === 0 ? (
          <div className="empty-state">No admins found</div>
        ) : (
          admins.map((admin) => (
            <div key={admin._id} className="admin-card">
              <div className="admin-avatar">
                {admin.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="admin-info">
                <div className="admin-name-row">
                  <h3>{admin.name}</h3>
                  <span className={`role-badge ${admin.role}`}>
                    {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                  </span>
                </div>
                <p>{admin.email}</p>
              </div>

              <div className="admin-meta">
                <span>{new Date(admin.createdAt).toLocaleDateString()}</span>
                <span className={admin.isVerified ? "verified" : "unverified"}>
                  {admin.isVerified ? "Verified" : "Unverified"}
                </span>
              </div>

              {admin.role !== "super_admin" && (
                <div className="admin-actions">
                  <button className="btn-edit" onClick={() => handleEdit(admin)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(admin._id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAdmin ? "Edit Admin" : "Add Admin"}</h2>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  disabled={editingAdmin}
                />
              </div>

              <div className="form-group">
                <label>Password {editingAdmin && "(leave blank to keep current)"}</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingAdmin ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
