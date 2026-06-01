import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/admins.css";

const API = "http://localhost:5000/api";

export default function Admins() {
  const [admins, setAdmins]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchAdmins(); }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/admin/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAdmins(data.admins || []);
    } catch { toast.error("Failed to load admins"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this admin?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API}/admin/admins/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Admin deleted");
      fetchAdmins();
    } catch (err) { toast.error(err.message); }
  };

  const totalAdmins      = admins.filter(a => a.role === "admin").length;
  const totalSuperAdmins = admins.filter(a => a.role === "super_admin").length;

  return (
    <div className="admins-page">

      {/* Header */}
      <div className="adm-header">
        <div>
          <h1>👥 Admin Management</h1>
          <p>Manage admin users and their access</p>
        </div>
        <button className="adm-add-btn" onClick={() => navigate("/admins/add")}>
          + Add Admin
        </button>
      </div>

      {/* Stats */}
      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-num">{admins.length}</span>
          <span className="adm-stat-lbl">Total Admins</span>
        </div>
        <div className="adm-stat-div" />
        <div className="adm-stat">
          <span className="adm-stat-num" style={{ color: "#2196f3" }}>{totalAdmins}</span>
          <span className="adm-stat-lbl">Admins</span>
        </div>
        <div className="adm-stat-div" />
        <div className="adm-stat">
          <span className="adm-stat-num" style={{ color: "#ff6b00" }}>{totalSuperAdmins}</span>
          <span className="adm-stat-lbl">Super Admins</span>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="adm-loading">Loading...</div>
      ) : admins.length === 0 ? (
        <div className="adm-empty">
          <span>👤</span>
          <p>No admins found</p>
          <button className="adm-add-btn" onClick={() => navigate("/admins/add")}>
            + Add First Admin
          </button>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin._id} className="adm-row">
                  <td>
                    <div className="adm-user">
                      <div className="adm-avatar" style={{
                        background: admin.role === "super_admin"
                          ? "linear-gradient(135deg,#ff6b00,#ff3d00)"
                          : "linear-gradient(135deg,#2196f3,#1565c0)"
                      }}>
                        {admin.name[0].toUpperCase()}
                      </div>
                      <span className="adm-name">{admin.name}</span>
                    </div>
                  </td>
                  <td className="adm-email">{admin.email}</td>
                  <td className="adm-phone">{admin.phone || "—"}</td>
                  <td className="adm-phone">{admin.department || "—"}</td>
                  <td>
                    <span className={`adm-role-badge ${admin.role === "super_admin" ? "super" : admin.role === "delivery" ? "delivery" : "admin"}`}>
                      {admin.role === "super_admin" ? "⭐ Super Admin" : admin.role === "delivery" ? "🚚 Delivery" : "🔧 Admin"}
                    </span>
                  </td>
                  <td>
                    <span className={`adm-status ${admin.isVerified ? "verified" : "unverified"}`}>
                      {admin.isVerified ? "✓ Active" : "Pending"}
                    </span>
                  </td>
                  <td className="adm-date">
                    {new Date(admin.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td>
                    {admin.role !== "super_admin" ? (
                      <div className="adm-actions">
                        <button className="adm-btn-edit"
                          onClick={() => navigate(`/admins/edit/${admin._id}`)}>
                          Edit
                        </button>
                        <button className="adm-btn-del"
                          onClick={() => handleDelete(admin._id)}>
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "#555", fontSize: "0.8rem" }}>Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
