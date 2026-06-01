import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/auth.css";

const API = "http://localhost:5000/api";

// Floating food particles
const PARTICLES = ["🍔","🍕","🍜","🌮","🍣","🥗","🍰","🥤","🍟","🌯"];

export default function Login() {
  const navigate  = useNavigate();
  const formRef   = useRef(null);
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused]  = useState("");
  const [shake, setShake]      = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("adminToken")) navigate("/dashboard");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      toast.error("Please fill all fields");
      return;
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

      if (data.user.role !== "admin" && data.user.role !== "super_admin") {
        throw new Error("Access denied. Admins only!");
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      localStorage.setItem("adminRole", data.user.role);

      toast.success(`Welcome, ${data.user.name}! 🎯`);
      navigate("/dashboard");
    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-page">

      {/* Animated background particles */}
      <div className="al-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span key={i} className="al-particle" style={{
            left:            `${(i * 10) % 95}%`,
            animationDelay:  `${i * 0.7}s`,
            animationDuration:`${8 + (i % 4) * 2}s`,
            fontSize:        `${1.2 + (i % 3) * 0.4}rem`,
          }}>{p}</span>
        ))}
      </div>

      {/* Glow blobs */}
      <div className="al-blob al-blob1" />
      <div className="al-blob al-blob2" />

      {/* Card */}
      <div className={`al-card ${shake ? "al-shake" : ""}`} ref={formRef}>

        {/* Logo */}
        <div className="al-logo">
          <div className="al-logo-ring">
            <span className="al-logo-emoji">🍔</span>
          </div>
          <div className="al-logo-text">
            <h1>The Hungry Hub</h1>
            <span>Admin Control Panel</span>
          </div>
        </div>

        {/* Divider */}
        <div className="al-divider">
          <span>Sign in to continue</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="al-form" autoComplete="off">

          {/* Email */}
          <div className={`al-field ${focused === "email" ? "focused" : ""} ${form.email ? "has-value" : ""}`}>
            <label>Email Address</label>
            <div className="al-input-wrap">
              <span className="al-input-icon">✉️</span>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                placeholder="Enter your email"
                autoComplete="off"
              />
              {form.email && (
                <span className="al-clear" onClick={() => setForm(p => ({ ...p, email: "" }))}>✕</span>
              )}
            </div>
          </div>

          {/* Password */}
          <div className={`al-field ${focused === "password" ? "focused" : ""} ${form.password ? "has-value" : ""}`}>
            <label>Password</label>
            <div className="al-input-wrap">
              <span className="al-input-icon">🔒</span>
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                placeholder="Enter your password"
                autoComplete="new-password"
              />
              <button type="button" className="al-eye" onClick={() => setShowPass(p => !p)}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
            {/* Password strength bar */}
            {form.password && (
              <div className="al-strength">
                <div className="al-strength-bar" style={{
                  width: `${Math.min(form.password.length * 10, 100)}%`,
                  background: form.password.length < 4 ? "#f44336"
                            : form.password.length < 8 ? "#ff9800"
                            : "#4caf50"
                }} />
              </div>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="al-submit" disabled={loading}>
            {loading ? (
              <span className="al-spinner" />
            ) : (
              <>
                <span>Sign In</span>
                <span className="al-arrow">→</span>
              </>
            )}
          </button>

        </form>

        {/* Footer */}
        <p className="al-footer-note">
          🔐 Authorized personnel only
        </p>

      </div>
    </div>
  );
}
