import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./Dashboard.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SC = { confirmed:"#2196f3", preparing:"#ff9800", out_for_delivery:"#9c27b0" };
const SL = { confirmed:"Confirmed", preparing:"Preparing", out_for_delivery:"Out for Delivery" };

// ── OTP Modal ─────────────────────────────────────────────────
function OtpModal({ orderId, onClose, onSuccess }) {
  const [otp, setOtp]         = useState(["","","","","",""]);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const refs = Array.from({ length: 6 }, () => null);
  const refArr = [];

  const sendOtp = async () => {
    setSending(true);
    try {
      const token = localStorage.getItem("deliveryToken");
      await axios.post(`${API}/delivery/orders/${orderId}/send-otp`, {},
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success("OTP sent to customer's email! 📧");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally { setSending(false); }
  };

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 5) refArr[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refArr[i - 1]?.focus();
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) { toast.error("Enter complete 6-digit OTP"); return; }
    setVerifying(true);
    try {
      const token = localStorage.getItem("deliveryToken");
      await axios.post(`${API}/delivery/orders/${orderId}/verify-otp`, { otp: code },
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success("🎉 Order delivered successfully!");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
      setOtp(["","","","","",""]);
      refArr[0]?.focus();
    } finally { setVerifying(false); }
  };

  return (
    <div className="dp-otp-overlay" onClick={onClose}>
      <div className="dp-otp-modal" onClick={e => e.stopPropagation()}>
        <div className="dp-otp-head">
          <span>🔐</span>
          <h3>Delivery Confirmation OTP</h3>
          <button className="dp-otp-close" onClick={onClose}>✕</button>
        </div>

        {!otpSent ? (
          <div className="dp-otp-body">
            <div className="dp-otp-icon">🚚</div>
            <p>Send a 6-digit OTP to the customer's email to confirm delivery.</p>
            <button className="dp-otp-send-btn" onClick={sendOtp} disabled={sending}>
              {sending ? "Sending..." : "📧 Send OTP to Customer"}
            </button>
          </div>
        ) : (
          <div className="dp-otp-body">
            <div className="dp-otp-icon">📱</div>
            <p>Ask the customer for the OTP sent to their email.</p>
            <div className="dp-otp-inputs">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { refArr[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className={`dp-otp-box ${digit ? "filled" : ""}`}
                />
              ))}
            </div>
            <button className="dp-otp-verify-btn" onClick={verifyOtp} disabled={verifying}>
              {verifying ? "Verifying..." : "✅ Verify & Mark Delivered"}
            </button>
            <button className="dp-otp-resend" onClick={() => { setOtp(["","","","","",""]); sendOtp(); }}>
              Resend OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats]   = useState({ pending:0, delivering:0, deliveredToday:0, totalDelivered:0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpOrderId, setOtpOrderId] = useState(null);
  const user = JSON.parse(localStorage.getItem("deliveryUser") || "{}");

  useEffect(() => { fetchData(); const t = setInterval(fetchData, 30000); return () => clearInterval(t); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("deliveryToken");
      const h = { Authorization: `Bearer ${token}` };
      const [s, o] = await Promise.all([
        axios.get(`${API}/delivery/stats`, { headers: h }),
        axios.get(`${API}/delivery/orders`, { headers: h }),
      ]);
      setStats(s.data);
      setOrders(o.data.orders || []);
    } catch { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("deliveryToken");
      await axios.put(`${API}/delivery/orders/${orderId}/status`, { status },
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success(status === "out_for_delivery" ? "🚚 Picked up!" : "🎉 Delivered!");
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const timeAgo = (d) => { const m = Math.floor((new Date() - new Date(d)) / 60000); return m < 1 ? "Just now" : m < 60 ? `${m}m ago` : `${Math.floor(m/60)}h ago`; };
  const hr = new Date().getHours();
  const greet = hr < 12 ? "Morning" : hr < 17 ? "Afternoon" : "Evening";

  return (
    <div className="dp-dash">
      <div className="dp-dash-head">
        <div>
          <h1>Good {greet}, {user.name?.split(" ")[0]}! 👋</h1>
          <p>Here's your delivery overview for today</p>
        </div>
        <button className="dp-refresh" onClick={fetchData}>🔄 Refresh</button>
      </div>

      <div className="dp-stats">
        {[
          { val: stats.pending,        lbl: "🔔 Pending",    color: "#ffc107" },
          { val: stats.delivering,     lbl: "🚚 Delivering", color: "#9c27b0" },
          { val: stats.deliveredToday, lbl: "✅ Today",      color: "#4caf50" },
          { val: stats.totalDelivered, lbl: "🏆 Total",      color: "#ff6b00" },
        ].map((s, i) => (
          <div key={i} className="dp-stat-item">
            <span className="dp-stat-val" style={{ color: s.color }}>{s.val}</span>
            <span className="dp-stat-lbl">{s.lbl}</span>
          </div>
        ))}
      </div>

      <div className="dp-sec-head">
        <h2>📦 Active Orders</h2>
        <Link to="/orders" className="dp-see-all">See All →</Link>
      </div>

      {loading ? <div className="dp-empty">⏳ Loading...</div>
      : orders.length === 0 ? <div className="dp-empty"><span>🎉</span><p>No active orders!</p></div>
      : (
        <div className="dp-grid">
          {orders.slice(0, 6).map(order => (
            <div className="dp-card" key={order._id}>
              <div className="dp-card-top">
                <span className="dp-oid">#{order._id.slice(-6).toUpperCase()}</span>
                <span className="dp-time">{timeAgo(order.createdAt)}</span>
              </div>
              <div className="dp-cust">
                <div className="dp-cust-av">{order.user?.name?.[0] || "?"}</div>
                <div>
                  <div className="dp-cust-name">{order.user?.name || "Customer"}</div>
                  <div className="dp-cust-ph">{order.user?.phone || "N/A"}</div>
                </div>
              </div>
              <div className="dp-addr">📍 {order.deliveryAddress?.line}, {order.deliveryAddress?.city}</div>
              <div className="dp-items">
                {order.items?.slice(0,2).map((item,i) => <span key={i} className="dp-pill">{item.qty}× {item.name}</span>)}
                {order.items?.length > 2 && <span className="dp-pill more">+{order.items.length-2}</span>}
              </div>
              <div className="dp-card-foot">
                <span className="dp-amt">₹{order.totalAmount}</span>
                <span className="dp-sbadge" style={{ color: SC[order.status], borderColor: SC[order.status] }}>{SL[order.status]}</span>
              </div>
              <div className="dp-actions">
                {order.status === "preparing" && (
                  <button className="dp-btn pickup" onClick={() => updateStatus(order._id, "out_for_delivery")}>🚚 Pick Up</button>
                )}
                {order.status === "out_for_delivery" && (
                  <button className="dp-btn deliver" onClick={() => setOtpOrderId(order._id)}>✅ Delivered</button>
                )}
                <Link to={`/orders/${order._id}`} className="dp-btn view">👁 Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OTP Modal */}
      {otpOrderId && (
        <OtpModal
          orderId={otpOrderId}
          onClose={() => setOtpOrderId(null)}
          onSuccess={() => { setOtpOrderId(null); fetchData(); }}
        />
      )}
    </div>
  );
}
