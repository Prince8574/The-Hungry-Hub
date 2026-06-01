import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./OrderDetail.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SC = { confirmed:"#2196f3", preparing:"#ff9800", out_for_delivery:"#9c27b0", delivered:"#4caf50" };
const SL = { confirmed:"Confirmed", preparing:"Preparing", out_for_delivery:"Out for Delivery", delivered:"Delivered" };

// ── OTP Modal (same as Dashboard) ────────────────────────────
function OtpModal({ orderId, onClose, onSuccess }) {
  const [otp, setOtp]         = useState(["","","","","",""]);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
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
    const newOtp = [...otp]; newOtp[i] = val.slice(-1); setOtp(newOtp);
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
                <input key={i} ref={el => { refArr[i] = el; }}
                  type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className={`dp-otp-box ${digit ? "filled" : ""}`} />
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

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOtp, setShowOtp] = useState(false);

  useEffect(() => { fetchOrder(); }, [id]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("deliveryToken");
      const res = await axios.get(`${API}/delivery/orders`, { headers: { Authorization: `Bearer ${token}` } });
      const found = res.data.orders?.find(o => o._id === id);
      if (found) setOrder(found);
      else toast.error("Order not found");
    } catch { toast.error("Failed to load order"); }
    finally { setLoading(false); }
  };

  const updateStatus = async (status) => {
    try {
      const token = localStorage.getItem("deliveryToken");
      await axios.put(`${API}/delivery/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(status === "out_for_delivery" ? "🚚 Picked up!" : "🎉 Delivered!");
      fetchOrder();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };  if (loading) return <div className="dp-od-load">⏳ Loading order...</div>;
  if (!order)  return <div className="dp-od-load">Order not found</div>;

  return (
    <div className="dp-od">
      <button className="dp-od-back" onClick={() => navigate(-1)}>← Back</button>

      <div className="dp-od-head">
        <div>
          <h1>Order #{order._id.slice(-6).toUpperCase()}</h1>
          <span className="dp-od-status" style={{ color: SC[order.status], borderColor: SC[order.status] }}>
            {SL[order.status]}
          </span>
        </div>
        <div className="dp-od-total">₹{order.totalAmount}</div>
      </div>

      <div className="dp-od-grid">
        <div className="dp-od-card">
          <div className="dp-od-ctitle">👤 Customer</div>
          <div className="dp-od-kv"><span>Name</span><span>{order.user?.name || "N/A"}</span></div>
          <div className="dp-od-kv"><span>Phone</span>
            <a href={`tel:${order.user?.phone}`} className="dp-od-phone">{order.user?.phone || "N/A"}</a>
          </div>
          <div className="dp-od-kv"><span>Email</span><span>{order.user?.email || "N/A"}</span></div>
        </div>

        <div className="dp-od-card">
          <div className="dp-od-ctitle">📍 Delivery Address</div>
          <p className="dp-od-addr">{order.deliveryAddress?.line}</p>
          <p className="dp-od-addr">{order.deliveryAddress?.city} {order.deliveryAddress?.pincode && `- ${order.deliveryAddress.pincode}`}</p>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(`${order.deliveryAddress?.line}, ${order.deliveryAddress?.city}`)}`}
            target="_blank" rel="noreferrer" className="dp-od-map">
            🗺️ Open in Maps
          </a>
        </div>

        <div className="dp-od-card">
          <div className="dp-od-ctitle">📋 Order Info</div>
          <div className="dp-od-kv"><span>Payment</span>
            <span className={order.paymentMethod === "cod" ? "dp-cod" : "dp-online"}>
              {order.paymentMethod === "cod" ? "💵 Cash on Delivery" : "💳 Online Paid"}
            </span>
          </div>
          <div className="dp-od-kv"><span>Delivery Fee</span><span>₹{order.deliveryFee || 0}</span></div>
          {order.discountAmount > 0 && (
            <div className="dp-od-kv"><span>Discount</span><span style={{color:"#4caf50"}}>-₹{order.discountAmount}</span></div>
          )}
          <div className="dp-od-kv dp-od-total-row"><span>Total</span><span>₹{order.totalAmount}</span></div>
        </div>
      </div>

      <div className="dp-od-card dp-od-items">
        <div className="dp-od-ctitle">🍽️ Items Ordered</div>
        {order.items?.map((item, i) => (
          <div key={i} className="dp-od-item">
            <span className="dp-od-iname">{item.name}</span>
            <span className="dp-od-iqty">× {item.qty}</span>
            <span className="dp-od-iprice">₹{item.price * item.qty}</span>
          </div>
        ))}
      </div>

      {(order.status === "preparing" || order.status === "out_for_delivery") && (
        <div className="dp-od-actions">
          {order.status === "preparing" && (
            <button className="dp-od-btn pickup" onClick={() => updateStatus("out_for_delivery")}>
              🚚 Pick Up Order
            </button>
          )}
          {order.status === "out_for_delivery" && (
            <button className="dp-od-btn deliver" onClick={() => setShowOtp(true)}>
              ✅ Mark as Delivered (OTP)
            </button>
          )}
        </div>
      )}

      {showOtp && (
        <OtpModal
          orderId={id}
          onClose={() => setShowOtp(false)}
          onSuccess={() => { setShowOtp(false); fetchOrder(); }}
        />
      )}
    </div>
  );
}
