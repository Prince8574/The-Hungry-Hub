import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/auth.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STEPS = ["Email", "Verify OTP", "New Password"];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep]           = useState(1);
  const [email, setEmail]         = useState("");
  const [otp, setOtp]             = useState(["","","","","",""]);
  const [resetToken, setResetToken] = useState("");
  const [newPass, setNewPass]     = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = Array.from({ length: 6 }, () => null);
  const refArr  = [];

  // ── Step 1: Send OTP ──────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
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
      setStep(2);
      setResendTimer(60);
      startTimer();
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  const startTimer = () => {
    let t = 60;
    const interval = setInterval(() => {
      t--;
      setResendTimer(t);
      if (t <= 0) clearInterval(interval);
    }, 1000);
  };

  // ── OTP input ─────────────────────────────────────────────
  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp]; newOtp[i] = val.slice(-1); setOtp(newOtp);
    if (val && i < 5) refArr[i + 1]?.focus();
  };
  const handleOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refArr[i - 1]?.focus();
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    const newOtp = [...otp];
    pasted.split("").forEach((c, i) => { newOtp[i] = c; });
    setOtp(newOtp);
    const next = newOtp.findIndex(v => !v);
    refArr[next === -1 ? 5 : next]?.focus();
  };

  // ── Step 2: Verify OTP ────────────────────────────────────
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

  // ── Step 3: Reset Password ────────────────────────────────
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
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="al-page">
      <div className="al-blob al-blob1" />
      <div className="al-blob al-blob2" />

      <div className="al-card al-mounted">

        {/* Header */}
        <div className="al-card-header">
          <div className="al-card-logo"><span>🔐</span></div>
          <div>
            <h2>Reset Password</h2>
            <p>The Hungry Hub · Admin</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="fp-steps">
          {STEPS.map((s, i) => (
            <div key={i} className={`fp-step ${step > i ? "done" : ""} ${step === i+1 ? "active" : ""}`}>
              <div className="fp-step-circle">{step > i+1 ? "✓" : i+1}</div>
              <span>{s}</span>
              {i < STEPS.length - 1 && <div className="fp-step-line" />}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Email ── */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="al-form">
            <p className="fp-desc">Enter your registered email address. We'll send a 6-digit OTP.</p>
            <div className="al-field">
              <label>Email Address</label>
              <div className="al-input-wrap">
                <span className="al-icon">✉️</span>
                <input type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com" autoComplete="off" />
              </div>
            </div>
            <button type="submit" className="al-submit-btn" disabled={loading}>
              {loading ? <><span className="al-spinner" /><span>Sending...</span></>
                       : <><span>Send OTP</span><span className="al-btn-arrow">→</span></>}
            </button>
            <Link to="/login" className="fp-back-link">← Back to Login</Link>
          </form>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="al-form">
            <p className="fp-desc">
              OTP sent to <strong style={{color:"#ff6b00"}}>{email}</strong>.<br/>
              Enter the 6-digit code below.
            </p>
            <div className="fp-otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input key={i} ref={el => { refArr[i] = el; }}
                  type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKey(i, e)}
                  className={`fp-otp-box ${digit ? "filled" : ""}`}
                />
              ))}
            </div>
            <button type="submit" className="al-submit-btn" disabled={loading}>
              {loading ? <><span className="al-spinner" /><span>Verifying...</span></>
                       : <><span>Verify OTP</span><span className="al-btn-arrow">→</span></>}
            </button>
            <div className="fp-resend">
              {resendTimer > 0
                ? <span>Resend in {resendTimer}s</span>
                : <button type="button" className="fp-resend-btn" onClick={handleSendOtp}>Resend OTP</button>
              }
            </div>
          </form>
        )}

        {/* ── STEP 3: New Password ── */}
        {step === 3 && (
          <form onSubmit={handleReset} className="al-form">
            <p className="fp-desc">Set your new password. Must be at least 6 characters.</p>
            <div className="al-field">
              <label>New Password</label>
              <div className="al-input-wrap">
                <span className="al-icon">🔒</span>
                <input type={showPass ? "text" : "password"} value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  placeholder="Min. 6 characters" autoComplete="new-password" />
                <button type="button" className="al-eye-btn" onClick={() => setShowPass(p => !p)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div className="al-field">
              <label>Confirm Password</label>
              <div className="al-input-wrap">
                <span className="al-icon">🔒</span>
                <input type={showPass ? "text" : "password"} value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  placeholder="Re-enter password" autoComplete="new-password" />
              </div>
              {confirmPass && newPass !== confirmPass && (
                <span style={{fontSize:"0.75rem",color:"#f44336",marginTop:"0.2rem"}}>Passwords do not match</span>
              )}
            </div>
            <button type="submit" className="al-submit-btn" disabled={loading || newPass !== confirmPass}>
              {loading ? <><span className="al-spinner" /><span>Resetting...</span></>
                       : <><span>Reset Password</span><span className="al-btn-arrow">→</span></>}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
