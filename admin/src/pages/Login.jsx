import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/auth.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const PARTICLES = ["🍔","🍕","🍜","🌮","🍣","🥗","🍰","🥤","🍟","🌯","🧆","🥙"];

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused]   = useState("");
  const [shake, setShake]       = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    if (localStorage.getItem("adminToken")) navigate("/dashboard");
    setTimeout(() => setMounted(true), 50);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      triggerShake(); toast.error("Please fill all fields"); return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      if (data.user.role !== "admin" && data.user.role !== "super_admin")
        throw new Error("Access denied. Admins only!");

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      localStorage.setItem("adminRole", data.user.role);
      toast.success(`Welcome, ${data.user.name}! 🎯`);
      navigate("/dashboard");
    } catch (err) {
      triggerShake();
      toast.error(err.message || "Invalid credentials");
    } finally { setLoading(false); }
  };

  const triggerShake = () => {
    setShake(true); setTimeout(() => setShake(false), 600);
  };

  const passStrength = form.password.length === 0 ? 0
    : form.password.length < 4 ? 1
    : form.password.length < 8 ? 2 : 3;
  const strengthColor = ["transparent","#f44336","#ff9800","#4caf50"][passStrength];
  const strengthWidth = [0, 33, 66, 100][passStrength];

  return (
    <div className="al-page">
      {/* Particles */}
      <div className="al-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span key={i} className="al-particle" style={{
            left: `${(i * 8.5) % 96}%`,
            animationDelay: `${i * 0.6}s`,
            animationDuration: `${9 + (i % 5) * 1.5}s`,
            fontSize: `${1 + (i % 3) * 0.35}rem`,
          }}>{p}</span>
        ))}
      </div>

      {/* Blobs */}
      <div className="al-blob al-blob1" />
      <div className="al-blob al-blob2" />
      <div className="al-blob al-blob3" />

      {/* Centered Card */}
      <div className={`al-card ${mounted ? "al-mounted" : ""} ${shake ? "al-shake" : ""}`}>

        {/* Logo */}
        <div className="al-card-header">
          <div className="al-card-logo"><span>🍔</span></div>
          <div>
            <h2>The Hungry Hub</h2>
            <p>Admin Control Panel</p>
          </div>
        </div>

        {/* Divider */}
        <div className="al-divider"><span>Sign in to continue</span></div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="al-form" autoComplete="off">

          {/* Email */}
          <div className={`al-field ${focused === "email" ? "focused" : ""}`}>
            <label>Email Address</label>
            <div className="al-input-wrap">
              <span className="al-icon">✉️</span>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                placeholder="admin@example.com"
                autoComplete="off"
              />
              {form.email && (
                <button type="button" className="al-clear-btn"
                  onClick={() => setForm(p => ({ ...p, email: "" }))}>✕</button>
              )}
            </div>
          </div>

          {/* Password */}
          <div className={`al-field ${focused === "password" ? "focused" : ""}`}>
            <label>Password</label>
            <div className="al-input-wrap">
              <span className="al-icon">🔒</span>
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                placeholder="Enter your password"
                autoComplete="new-password"
              />
              <button type="button" className="al-eye-btn"
                onClick={() => setShowPass(p => !p)}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
            <div className="al-strength-track">
              <div className="al-strength-fill" style={{ width:`${strengthWidth}%`, background: strengthColor }} />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="al-submit-btn" disabled={loading}>
            {loading ? (
              <><span className="al-spinner" /><span>Signing in...</span></>
            ) : (
              <><span>Sign In</span><span className="al-btn-arrow">→</span></>
            )}
          </button>

          <Link to="/forgot-password" className="fp-back-link" style={{marginTop:"0.75rem"}}>
            Forgot Password?
          </Link>

        </form>

        <div className="al-card-footer">
          <span>🔐</span><span>Authorized personnel only</span>
        </div>

      </div>
    </div>
  );
}
