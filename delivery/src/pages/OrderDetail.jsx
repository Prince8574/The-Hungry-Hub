import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./OrderDetail.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SC = { confirmed:"#2196f3", preparing:"#ff9800", out_for_delivery:"#9c27b0", delivered:"#4caf50" };
const SL = { confirmed:"Confirmed", preparing:"Preparing", out_for_delivery:"Out for Delivery", delivered:"Delivered" };

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);

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
  };

  if (loading) return <div className="dp-od-load">⏳ Loading order...</div>;
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
            <button className="dp-od-btn deliver" onClick={() => updateStatus("delivered")}>
              ✅ Mark as Delivered
            </button>
          )}
        </div>
      )}
    </div>
  );
}
