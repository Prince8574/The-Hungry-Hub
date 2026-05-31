import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLeft from "../components/AuthLeft";
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Important for cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Check if user is admin or super_admin
      if (data.user.role !== "admin" && data.user.role !== "super_admin") {
        toast.error("Access denied. Admins only!");
        setLoading(false);
        return;
      }

      // Save token, user info, and role
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      localStorage.setItem("adminRole", data.user.role);
      
      console.log("Login successful:", data.user);
      console.log("Token saved:", data.token);
      
      toast.success(`Welcome back, ${data.user.name}! 🎯`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left Side — Branding */}
      <AuthLeft />

      {/* Right Side — Login Form */}
      <div className="auth-right">
        <div className="auth-form-box">
          <h2 className="auth-title">Admin Login</h2>
          <p className="auth-subtitle">Sign in to access the control panel</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="admin@hungry.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPass ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : "Sign In"}
            </button>
          </form>

          <div className="demo-credentials">
            <p className="demo-label">Demo Credentials:</p>
            <div style={{ marginBottom: '0.8rem' }}>
              <p className="demo-text"><strong>Super Admin:</strong></p>
              <p className="demo-text">Email: superadmin@hungry.com</p>
              <p className="demo-text">Password: super123</p>
            </div>
            <div>
              <p className="demo-text"><strong>Admin:</strong></p>
              <p className="demo-text">Email: admin@hungry.com</p>
              <p className="demo-text">Password: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
