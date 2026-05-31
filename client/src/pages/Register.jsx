import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast from "react-hot-toast";
import AuthLeft from "../components/auth/AuthLeft";
import "../styles/auth.css";

// ── Step indicators ──────────────────────────────────────────────
const STEPS = ["Details", "Verify OTP", "Done"];

export default function Register() {
  const formRef = useRef(null);
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = form, 2 = otp, 3 = success
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Entrance animation
  useGSAP(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  // Animate step change
  const animateStep = () => {
    gsap.fromTo(
      ".auth-form-box",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
  };

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Step 1: Submit form → send OTP ───────────────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      toast.success(`OTP sent to ${email} 📧`);
      setStep(2);
      setResendTimer(60);
      animateStep();
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handling ───────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only last digit
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((v) => !v);
    const focusIdx = nextEmpty === -1 ? 5 : nextEmpty;
    otpRefs.current[focusIdx]?.focus();
  };

  // ── Step 2: Verify OTP → register ───────────────────────────
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast.error("Enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Save token to localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setStep(3);
      animateStep();
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      toast.error(err.message);
      // Shake OTP boxes on error
      gsap.fromTo(
        ".otp-inputs",
        { x: -8 },
        { x: 0, duration: 0.4, ease: "elastic.out(1,0.3)", repeat: 3, yoyo: true }
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, name: formData.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");
      toast.success("New OTP sent! 📧");
      setOtp(["", "", "", "", "", ""]);
      setResendTimer(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <AuthLeft />

      <div className="auth-right" ref={formRef}>
        <div className="auth-form-box">

          {/* Logo */}
          <div className="auth-logo">
            <span className="logo-icon">🍔</span>
            <span className="logo-text">The Hungry Hub</span>
          </div>

          {/* Step Indicator */}
          <div className="step-indicator">
            {STEPS.map((label, i) => (
              <div key={i} className={`step-item ${step > i ? "done" : ""} ${step === i + 1 ? "active" : ""}`}>
                <div className="step-circle">
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className="step-label">{label}</span>
                {i < STEPS.length - 1 && <div className="step-line" />}
              </div>
            ))}
          </div>

          {/* ── STEP 1: Registration Form ── */}
          {step === 1 && (
            <>
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">Join us and explore delicious food</p>

              <form onSubmit={handleFormSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">✉️</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showPass ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
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

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showPass ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <span className="spinner" /> : "Send OTP →"}
                </button>
              </form>

              <p className="auth-switch">
                Already have an account?{" "}
                <Link to="/login" className="switch-link">Sign In</Link>
              </p>
            </>
          )}

          {/* ── STEP 2: OTP Verification ── */}
          {step === 2 && (
            <>
              <h2 className="auth-title">Verify Email</h2>
              <p className="auth-subtitle">
                We sent a 6-digit OTP to<br />
                <strong className="otp-email">{formData.email}</strong>
              </p>

              <form onSubmit={handleOtpSubmit} className="auth-form">
                <div className="otp-inputs" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`otp-box ${digit ? "filled" : ""}`}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>

                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <span className="spinner" /> : "Verify & Register"}
                </button>
              </form>

              <div className="otp-footer">
                <p className="auth-switch">
                  Didn't receive OTP?{" "}
                  <button
                    className={`resend-btn ${resendTimer > 0 ? "disabled" : ""}`}
                    onClick={handleResend}
                    disabled={resendTimer > 0 || loading}
                    type="button"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                  </button>
                </p>
                <button
                  className="back-btn"
                  onClick={() => { setStep(1); animateStep(); }}
                  type="button"
                >
                  ← Change Email
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 3 && (
            <div className="success-box">
              <div className="success-icon">🎉</div>
              <h2 className="auth-title">You're In!</h2>
              <p className="auth-subtitle">
                Account created successfully.<br />Redirecting to homepage...
              </p>
              <div className="success-loader">
                <div className="success-bar" />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
