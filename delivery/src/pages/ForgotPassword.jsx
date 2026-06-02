import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./ForgotPassword.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const STEPS = ["Email", "Verify OTP", "New Password"];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep]               = useState(1);
  const [email, setEmail]             = useState("");
  const [otp, setOtp]                 = useState(["","","","","",""]);
  const [resetToken, setResetToken]   = useState("");
  const [newPass, setNewPass]         = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const refArr = [];

  const startTimer = () => {
    let t = 60;
    setResendTimer(t);
    const iv = setInterval(() => { t--; setResendTimer(t); if (t <= 0) clearInterval(iv); }, 1000);
  };

  // Step 1 — Send OTP
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!email) { toast.error("Enter your email"); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("OTP sent to your email 📧");
      setStep(2); startTimer();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  // OTP handlers
  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const n = [...otp]; n[i] = val.slice(-1); setOtp(n);
    if (val && i < 5) refArr[i + 1]?.focus();
  };
  const handleOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refArr[i - 1]?.focus();
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    const n = [...otp]; p.split("").forEach((c,i) => { n[i]=c; }); setOtp(n);
    const next = n.findIndex(v => !v); refArr[next === -1 ? 5 : next]?.focus();
  };

  // Step 2 — Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { toast.error("Enter complete 6-digit OTP"); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResetToken(data.resetToken);
      toast.success("OTP verified ✅");
      setStep(3);
    } catch (err) {
      toast.error(err.message);
      setOtp(["","","","","",""]);
      refArr[0]?.focus();
    } finally { setLoading(false); }
  };

  // Step 3 — Reset Password
  const handleReset = async (e) => {
    e.preventDefault();
    if (newPass.length < 6) { toast.error("Password min 6 characters"); return; }
    if (newPass !== confirmPass) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Password reset successfully! 🎉");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="dfp-page">
      <div className="dfp-bg" />

      <div className="dfp-card">
        {/* Logo */}
        <div className="dfp-logo">
          <div className="dfp-logo-circle">🔐</div>
          <h1>Reset Password</h1>
          <p>Delivery Partner Portal</p>
        </div>

        {/* Steps */}
        <div className="dfp-steps">
          {STEPS.map((s, i) => (
            <div key={i} className={`dfp-step ${step > i ? "done" : ""} ${step === i+1 ? "active" : ""}`}>
              <div className="dfp-step-dot">{step > i+1 ? "✓" : i+1}</div>
              <span>{s}</span>
              {i < STEPS.length - 1 && <div className="dfp-step-line" />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="dfp-form" autoComplete="off">
            <p className="dfp-desc">Enter your registered email. We'll send a 6-digit OTP.</p>
            <div className="dfp-field">
              <label>Email Address</label>
              <div className="dfp-input-wrap">
                <span>✉️</span>
                <input type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="delivery@example.com" />
              </div>
            </div>
            <button type="submit" className="dfp-btn" disabled={loading}>
              {loading ? "Sending..." : "📧 Send OTP →"}
            </button>
            <Link to="/login" className="dfp-back">← Back to Login</Link>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="dfp-form">
            <p className="dfp-desc">
              OTP sent to <strong style={{color:"#ff6b00"}}>{email}</strong>.<br/>Enter the 6-digit code.
            </p>
            <div className="dfp-otp-wrap" onPaste={handlePaste}>
              {otp.map((d, i) => (
                <input key={i} ref={el => { refArr[i] = el; }}
                  type="text" inputMode="numeric" maxLength={1} value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKey(i, e)}
                  className={`dfp-otp-box ${d ? "filled" : ""}`} />
              ))}
            </div>
            <button type="submit" className="dfp-btn" disabled={loading}>
              {loading ? "Verifying..." : "✅ Verify OTP →"}
            </button>
            <p className="dfp-resend">
              {resendTimer > 0
                ? <span>Resend in {resendTimer}s</span>
                : <button type="button" className="dfp-resend-btn" onClick={handleSendOtp}>Resend OTP</button>}
            </p>
          </form>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form onSubmit={handleReset} className="dfp-form">
            <p className="dfp-desc">Set your new password.</p>
            <div className="dfp-field">
              <label>New Password</label>
              <div className="dfp-input-wrap">
                <span>🔒</span>
                <input type={showPass ? "text" : "password"} value={newPass}
                  onChange={e => setNewPass(e.target.value)} placeholder="Min. 6 characters" />
                <button type="button" className="dfp-eye" onClick={() => setShowPass(p=>!p)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div className="dfp-field">
              <label>Confirm Password</label>
              <div className="dfp-input-wrap">
                <span>🔒</span>
                <input type={showPass ? "text" : "password"} value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)} placeholder="Re-enter password" />
              </div>
              {confirmPass && newPass !== confirmPass && (
                <span style={{fontSize:"0.72rem",color:"#f44336"}}>Passwords do not match</span>
              )}
            </div>
            <button type="submit" className="dfp-btn"
              disabled={loading || (confirmPass && newPass !== confirmPass)}>
              {loading ? "Resetting..." : "🔑 Reset Password →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
