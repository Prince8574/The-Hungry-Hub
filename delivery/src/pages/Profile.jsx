import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./Profile.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("deliveryUser") || "{}");
  const [form, setForm]   = useState({ name: user.name || "", phone: user.phone || "" });
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("deliveryToken");
      await axios.put(`${API}/user/profile`, form, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem("deliveryUser", JSON.stringify({ ...user, ...form }));
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally { setSaving(false); }
  };

  return (
    <div className="dp-profile">
      <div className="dp-profile-hero">
        <div className="dp-profile-av">{user.name?.[0] || "D"}</div>
        <div>
          <h1>{user.name}</h1>
          <p>🚚 Delivery Partner</p>
          <span>{user.email}</span>
        </div>
      </div>

      <div className="dp-profile-grid">
        <div className="dp-pcard">
          <div className="dp-pcard-title">👤 Update Profile</div>
          <form onSubmit={handleUpdate} className="dp-pform">
            <div className="dp-pfield">
              <label>Full Name</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
            </div>
            <div className="dp-pfield">
              <label>Phone Number</label>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
            </div>
            <button type="submit" className="dp-psave" disabled={saving}>
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>
          </form>
        </div>

        <div className="dp-pcard">
          <div className="dp-pcard-title">ℹ️ Account Info</div>
          <div className="dp-pkv"><span>Email</span><span>{user.email}</span></div>
          <div className="dp-pkv"><span>Role</span><span style={{color:"#ff6b00"}}>Delivery Partner</span></div>
          <div className="dp-pkv"><span>Status</span><span style={{color:"#4caf50"}}>✓ Active</span></div>
          <div className="dp-ptip">💡 Contact your admin to change email or reset password.</div>
        </div>
      </div>
    </div>
  );
}
