import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import "./Login.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error("Fill all fields"); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/delivery/login`, form);
      localStorage.setItem("deliveryToken", res.data.token);
      localStorage.setItem("deliveryUser", JSON.stringify(res.data.user));
      toast.success(`Welcome, ${res.data.user.name}! 🚚`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="dl-page">
      <div className="dl-bg" />
      <div className="dl-card">
        <div className="dl-logo">
          <div className="dl-logo-circle">🍔</div>
          <h1>The Hungry Hub</h1>
          <p>Delivery Partner Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="dl-form" autoComplete="off">
          <div className="dl-field">
            <label>Email Address</label>
            <div className="dl-input-wrap">
              <span className="dl-icon">✉️</span>
              <input type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="delivery@example.com" autoComplete="off" />
            </div>
          </div>
          <div className="dl-field">
            <label>Password</label>
            <div className="dl-input-wrap">
              <span className="dl-icon">🔒</span>
              <input type={showPass ? "text" : "password"} value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Enter your password" autoComplete="new-password" />
              <button type="button" className="dl-eye" onClick={() => setShowPass(p => !p)}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button type="submit" className="dl-btn" disabled={loading}>
            {loading ? "Logging in..." : "🚚 Login to Delivery Panel"}
          </button>
        </form>
        <p className="dl-note">Only authorized delivery partners can access this portal.</p>
      </div>
    </div>
  );
}
