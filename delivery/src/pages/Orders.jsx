import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./Orders.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SC = { confirmed:"#2196f3", preparing:"#ff9800", out_for_delivery:"#9c27b0" };
const SL = { confirmed:"Confirmed", preparing:"Preparing", out_for_delivery:"Out for Delivery" };
const FILTERS = [
  { value:"all", label:"All" },
  { value:"confirmed", label:"✅ Confirmed" },
  { value:"preparing", label:"👨‍🍳 Preparing" },
  { value:"out_for_delivery", label:"🚚 Out for Delivery" },
];

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("deliveryToken");
      const res = await axios.get(`${API}/delivery/orders`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data.orders || []);
    } catch { toast.error("Failed to load orders"); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("deliveryToken");
      await axios.put(`${API}/delivery/orders/${orderId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(status === "out_for_delivery" ? "🚚 Picked up!" : "🎉 Delivered!");
      fetchOrders();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const timeAgo = (d) => { const m = Math.floor((new Date() - new Date(d)) / 60000); return m < 1 ? "Just now" : m < 60 ? `${m}m ago` : `${Math.floor(m/60)}h ago`; };

  const filtered = orders.filter(o => {
    const mf = filter === "all" || o.status === filter;
    const ms = !search || o._id.toLowerCase().includes(search.toLowerCase()) || o.user?.name?.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  return (
    <div className="dp-orders">
      <div className="dp-orders-head">
        <div><h1>📦 All Orders</h1><p>{filtered.length} orders</p></div>
        <button className="dp-refresh" onClick={fetchOrders}>🔄 Refresh</button>
      </div>

      <div className="dp-filters">
        <div className="dp-search">
          <span>🔍</span>
          <input placeholder="Search by ID or customer..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="dp-pills">
          {FILTERS.map(f => (
            <button key={f.value} className={`dp-fpill ${filter === f.value ? "active" : ""}`} onClick={() => setFilter(f.value)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="dp-empty">⏳ Loading...</div>
      : filtered.length === 0 ? <div className="dp-empty"><span>📭</span><p>No orders found</p></div>
      : (
        <div className="dp-list">
          {filtered.map(order => (
            <div className="dp-row" key={order._id}>
              <div className="dp-row-l">
                <span className="dp-oid">#{order._id.slice(-6).toUpperCase()}</span>
                <div className="dp-cust-info">
                  <strong>{order.user?.name || "Customer"}</strong>
                  <span>{order.user?.phone || "N/A"}</span>
                </div>
                <div className="dp-addr-sm">📍 {order.deliveryAddress?.line}, {order.deliveryAddress?.city}</div>
              </div>
              <div className="dp-row-m">
                <div className="dp-items">
                  {order.items?.slice(0,2).map((item,i) => <span key={i} className="dp-pill">{item.qty}× {item.name}</span>)}
                  {order.items?.length > 2 && <span className="dp-pill more">+{order.items.length-2}</span>}
                </div>
                <div className="dp-meta">
                  <span className="dp-amt">₹{order.totalAmount}</span>
                  <span className="dp-time">{timeAgo(order.createdAt)}</span>
                </div>
              </div>
              <div className="dp-row-r">
                <span className="dp-sbadge" style={{ color: SC[order.status], borderColor: SC[order.status] }}>{SL[order.status]}</span>
                <div className="dp-row-actions">
                  {order.status === "preparing" && (
                    <button className="dp-btn pickup" onClick={() => updateStatus(order._id, "out_for_delivery")}>🚚 Pick Up</button>
                  )}
                  {order.status === "out_for_delivery" && (
                    <button className="dp-btn deliver" onClick={() => updateStatus(order._id, "delivered")}>✅ Delivered</button>
                  )}
                  <Link to={`/orders/${order._id}`} className="dp-btn view">👁</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
