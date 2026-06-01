import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/add-admin.css";

const API = "http://localhost:5000/api";

const EMPTY = {
  name: "", email: "", password: "", phone: "",
  role: "admin", department: "", notes: "",
};

export default function AddAdmin() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const isEdit   = !!id;

  const [form, setForm]               = useState(EMPTY);
  const [submitting, setSubmitting]   = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [showPass, setShowPass]       = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [docName, setDocName]         = useState("");
  const photoRef = useRef();
  const docRef   = useRef();

  // ── Fetch admin data in edit mode ──────────────────────────
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res   = await fetch(`${API}/admin/admins`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data  = await res.json();
        const admin = (data.admins || []).find(a => a._id === id);
        if (admin) {
          setForm({
            name:       admin.name       || "",
            email:      admin.email      || "",
            password:   "",
            phone:      admin.phone      || "",
            role:       admin.role       || "admin",
            department: admin.department || "",
            notes:      admin.notes      || "",
          });
        } else {
          toast.error("Admin not found");
          navigate("/admins");
        }
      } catch {
        toast.error("Failed to load admin data");
      } finally {
        setLoadingData(false);
      }
    })();
  }, [id, isEdit, navigate]);

  // ── Handle input changes ───────────────────────────────────
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "profilePhoto") {
        setPhotoPreview(URL.createObjectURL(files[0]));
      } else {
        setDocName(files[0].name);
      }
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
  };

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error("Name and email required"); return; }
    if (!isEdit && !form.password)  { toast.error("Password is required"); return; }
    if (!isEdit && form.password.length < 6) { toast.error("Password min 6 chars"); return; }

    setSubmitting(true);
    try {
      const token  = localStorage.getItem("adminToken");
      const url    = isEdit ? `${API}/admin/admins/${id}` : `${API}/admin/admins`;
      const method = isEdit ? "PUT" : "POST";
      const body   = {
        name:       form.name,
        email:      form.email,
        phone:      form.phone,
        role:       form.role,
        department: form.department,
        notes:      form.notes,
      };
      if (form.password) body.password = form.password;

      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      toast.success(
        isEdit ? "✅ Admin updated!" : "✅ Admin created! Credentials sent 📧",
        { style: { background: "#1a1a1a", color: "#fff", border: "1px solid #ff6b00" } }
      );
      navigate("/admins");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────
  if (loadingData) {
    return (
      <div className="aa-page">
        <div className="aa-loading">⏳ Loading admin data...</div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="aa-page">

      {/* Header */}
      <div className="aa-header">
        <button className="aa-back" onClick={() => navigate("/admins")}>← Back</button>
        <div>
          <h1>{isEdit ? "✏️ Edit Admin" : "➕ Add New Admin"}</h1>
          <p>
            {isEdit
              ? "Update admin details below"
              : "Fill in the details — login credentials will be emailed automatically"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="aa-form" autoComplete="off">
        <div className="aa-grid">

          {/* ══ LEFT COLUMN ══ */}
          <div className="aa-left">

            {/* Profile Photo */}
            <div className="aa-card">
              <div className="aa-card-title">📷 Profile Photo</div>
              <div className="aa-photo-box" onClick={() => photoRef.current.click()}>
                {photoPreview ? (
                  <img src={photoPreview} alt="preview" className="aa-photo-img" />
                ) : (
                  <div className="aa-photo-empty">
                    <span>📷</span>
                    <p>Click to upload</p>
                    <small>JPG, PNG — max 2MB</small>
                  </div>
                )}
                <input ref={photoRef} type="file" name="profilePhoto"
                  accept="image/*" onChange={handleChange} hidden />
              </div>
            </div>

            {/* Role */}
            <div className="aa-card">
              <div className="aa-card-title">🔑 Role</div>
              <div className="aa-role-list">
                {[
                  { val: "admin",       label: "🔧 Admin",       desc: "Menu & order management" },
                  { val: "super_admin", label: "⭐ Super Admin",  desc: "Full system access" },
                  { val: "delivery",    label: "🚚 Delivery Boy", desc: "Delivery & order pickup" },
                ].map(r => (
                  <div
                    key={r.val}
                    className={`aa-role-item ${form.role === r.val ? "active" : ""}`}
                    onClick={() => setForm(p => ({ ...p, role: r.val }))}
                  >
                    <div className="aa-role-check">{form.role === r.val ? "●" : "○"}</div>
                    <div>
                      <div className="aa-role-name">{r.label}</div>
                      <div className="aa-role-desc">{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ID Document */}
            <div className="aa-card">
              <div className="aa-card-title">📄 ID Document</div>
              <div className="aa-doc-box" onClick={() => docRef.current.click()}>
                <span className="aa-doc-icon">📎</span>
                <div>
                  <p className="aa-doc-name">{docName || "Upload document"}</p>
                  <small>{docName ? "✓ File selected" : "Aadhar / PAN / Passport"}</small>
                </div>
                <input ref={docRef} type="file" name="idDocument"
                  accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} hidden />
              </div>
            </div>

          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="aa-right">

            {/* Basic Info */}
            <div className="aa-card">
              <div className="aa-card-title">👤 Basic Information</div>

              <div className="aa-row2">
                <div className="aa-field">
                  <label>Full Name <span className="req">*</span></label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="aa-field">
                  <label>Phone Number</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="aa-field">
                <label>Email Address <span className="req">*</span></label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  disabled={isEdit}
                  autoComplete="off"
                  required
                />
                {!isEdit && (
                  <span className="aa-hint">📧 Login credentials will be sent to this email</span>
                )}
              </div>

              <div className="aa-field">
                <label>Department</label>
                <select name="department" value={form.department} onChange={handleChange}>
                  <option value="">Select department</option>
                  <option value="operations">Operations</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="delivery">Delivery</option>
                  <option value="support">Customer Support</option>
                  <option value="finance">Finance</option>
                  <option value="management">Management</option>
                </select>
              </div>
            </div>

            {/* Security */}
            <div className="aa-card">
              <div className="aa-card-title">🔒 Security</div>
              <div className="aa-field">
                <label>
                  {isEdit ? "New Password" : "Password"}{" "}
                  {!isEdit && <span className="req">*</span>}
                </label>
                <div className="aa-pass-wrap">
                  <input
                    name="password"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder={isEdit ? "Leave blank to keep current" : "Min. 6 characters"}
                  />
                  <button type="button" className="aa-pass-eye"
                    onClick={() => setShowPass(p => !p)}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {!isEdit && (
                  <span className="aa-hint">This password will be included in the welcome email</span>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="aa-card">
              <div className="aa-card-title">📝 Notes</div>
              <div className="aa-field">
                <label>Additional Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Responsibilities, shift timings, or any other notes..."
                  rows={4}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Submit Bar */}
        <div className="aa-submit-bar">
          <button type="button" className="aa-btn-cancel" onClick={() => navigate("/admins")}>
            Cancel
          </button>
          <button type="submit" className="aa-btn-submit" disabled={submitting}>
            {submitting
              ? "⏳ Processing..."
              : isEdit
                ? "💾 Save Changes"
                : "✅ Create Admin & Send Email"}
          </button>
        </div>

      </form>
    </div>
  );
}
