import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast from "react-hot-toast";
import axios from "axios";
import "../styles/orders.css";

const API_URL = "http://localhost:5000/api";

const STATUS_OPTIONS = [
  { value: "pending",          label: "New Order",       emoji: "🔔", color: "#ffc107" },
  { value: "confirmed",        label: "Confirmed",       emoji: "✅", color: "#2196f3" },
  { value: "preparing",        label: "Preparing",       emoji: "👨‍🍳", color: "#ff9800" },
  { value: "out_for_delivery", label: "Out for Delivery",emoji: "🚚", color: "#9c27b0" },
  { value: "delivered",        label: "Delivered",       emoji: "🎉", color: "#4caf50" },
  { value: "cancelled",        label: "Cancelled",       emoji: "❌", color: "#f44336" },
];

const getStatusOpt = (val) => STATUS_OPTIONS.find(s => s.value === val) || STATUS_OPTIONS[0];

export default function Orders() {
  const [orders, setOrders]             = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm]     = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading]           = useState(true);
  const statsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) { navigate("/login"); return; }
      const res = await axios.get(`${API_URL}/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.orders.map(o => ({
        id:      o._id,
        shortId: o._id.slice(-6).toUpperCase(),
        customer: o.user?.name || "Guest",
        phone:    o.user?.phone || "N/A",
        email:    o.user?.email || "N/A",
        items:    o.items.map(i => ({
          name:  i.name || i.menuItem?.name || "Item",
          qty:   i.qty,
          price: i.price,
        })),
        amount:   o.totalAmount,
        status:   o.status,
        time:     getTimeAgo(o.createdAt),
        address:  `${o.deliveryAddress?.line || ""}, ${o.deliveryAddress?.city || ""}`,
        payment:  o.paymentMethod === "cod" ? "COD" : "Online",
      }));
      setOrders(data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else toast.error("Failed to load orders");
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const s = Math.floor((new Date() - new Date(date)) / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`${API_URL}/orders/${orderId}/status`, { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      const opt = getStatusOpt(newStatus);
      toast.success(`${opt.emoji} ${opt.label}`, {
        style: { background: "#1a1a1a", color: "#fff", border: `1px solid ${opt.color}` }
      });
    } catch {
      toast.error("Failed to update status");
    }
  };

  const printLabel = (order) => {
    const itemsHtml = order.items.map(item => `
      <div class="item-row">
        <span class="item-name">${item.name}</span>
        <span class="item-qty">× ${item.qty}</span>
        <span class="item-price">₹${(item.price * item.qty).toLocaleString()}</span>
      </div>`).join("");

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Order #${order.shortId}</title>
  <style>
    @page { size: 10cm 14cm; margin: 0; }
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: Arial, sans-serif;
      background: #fff;
      width: 10cm;
      min-height: 14cm;
      padding: 14px;
    }
    /* Brand */
    .brand {
      text-align: center;
      padding-bottom: 10px;
      border-bottom: 3px dashed #ff6b00;
      margin-bottom: 12px;
    }
    .brand-name { font-size: 20px; font-weight: 900; color: #ff6b00; }
    .brand-sub  { font-size: 10px; color: #999; margin-top: 2px; }
    /* Order ID */
    .order-id {
      background: #ff6b00;
      color: #fff;
      text-align: center;
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 3px;
      padding: 7px;
      border-radius: 7px;
      margin-bottom: 12px;
    }
    /* Section */
    .section { margin-bottom: 10px; }
    .section-title {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #ff6b00;
      border-bottom: 1px solid #ff6b00;
      padding-bottom: 3px;
      margin-bottom: 6px;
    }
    /* KV rows */
    .kv { display:flex; justify-content:space-between; font-size:12px; padding:2px 0; }
    .kv-label { color:#888; }
    .kv-value { font-weight:600; color:#111; text-align:right; max-width:65%; }
    /* Items */
    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      padding: 4px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .item-name  { flex:1; color:#222; }
    .item-qty   { color:#888; margin: 0 10px; }
    .item-price { font-weight:700; color:#222; }
    /* Total */
    .total-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 900;
      padding: 7px 0 0;
      border-top: 2px solid #222;
      margin-top: 4px;
    }
    .total-row span:last-child { color: #ff6b00; }
    /* Payment */
    .payment {
      text-align: center;
      border: 2px solid #222;
      border-radius: 7px;
      padding: 7px;
      font-size: 13px;
      font-weight: 800;
      margin: 10px 0;
      background: #f9f9f9;
    }
    /* Footer */
    .footer {
      text-align: center;
      font-size: 9px;
      color: #bbb;
      border-top: 1px dashed #ddd;
      padding-top: 7px;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="brand">
    <div class="brand-name">🍔 The Hungry Hub</div>
    <div class="brand-sub">Fresh Food · Fast Delivery</div>
  </div>

  <div class="order-id"># ${order.shortId}</div>

  <div class="section">
    <div class="section-title">📦 Deliver To</div>
    <div class="kv"><span class="kv-label">Name</span><span class="kv-value">${order.customer}</span></div>
    <div class="kv"><span class="kv-label">Phone</span><span class="kv-value">${order.phone}</span></div>
    <div class="kv"><span class="kv-label">Address</span><span class="kv-value">${order.address}</span></div>
  </div>

  <div class="section">
    <div class="section-title">🍽️ Items Ordered</div>
    ${itemsHtml}
    <div class="total-row">
      <span>Total</span>
      <span>₹${order.amount.toLocaleString()}</span>
    </div>
  </div>

  <div class="payment">
    ${order.payment === "COD" ? "💵 CASH ON DELIVERY" : "✅ PAID ONLINE"}
  </div>

  <div class="footer">
    ${new Date().toLocaleString("en-IN")} &nbsp;|&nbsp; Thank you! 🙏
  </div>

  <script>
    window.onload = function() { window.print(); };
    window.onafterprint = function() { window.close(); };
  </script>
</body>
</html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
  };

  useGSAP(() => {
    gsap.fromTo(".orders-page", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
  }, []);

  useEffect(() => {
    statsRef.current.forEach((el, i) => {
      if (!el) return;
      const target = parseInt(el.getAttribute("data-target") || "0");
      gsap.to(el, { innerText: target, duration: 1.2, snap: { innerText: 1 }, delay: i * 0.1, ease: "power1.out" });
    });
  }, [orders]);

  const filtered = orders.filter(o => {
    const matchSearch = !searchTerm ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shortId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const count = (s) => orders.filter(o => o.status === s).length;
  const revenue = orders.reduce((s, o) => s + o.amount, 0);

  return (
    <div className="orders-page">

      {/* ── Header ── */}
      <div className="op-header">
        <div>
          <h1>📦 Orders</h1>
          <p>Real-time order management</p>
        </div>
        <div className="op-header-right">
          <div className="op-search">
            <span>🔍</span>
            <input placeholder="Search name or ID…" value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="op-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Orders</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>
            ))}
          </select>
          <button className="op-refresh" onClick={() => { fetchOrders(); toast.success("Refreshed!"); }}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="op-stats">
        <div className="op-stat-item">
          <span className="op-stat-val">{orders.length}</span>
          <span className="op-stat-lbl">Total Orders</span>
        </div>
        <div className="op-stat-divider" />
        <div className="op-stat-item">
          <span className="op-stat-val" style={{color:"#ffc107"}}>{count("pending")}</span>
          <span className="op-stat-lbl">🔔 New</span>
        </div>
        <div className="op-stat-divider" />
        <div className="op-stat-item">
          <span className="op-stat-val" style={{color:"#ff9800"}}>{count("preparing")}</span>
          <span className="op-stat-lbl">👨‍🍳 Preparing</span>
        </div>
        <div className="op-stat-divider" />
        <div className="op-stat-item">
          <span className="op-stat-val" style={{color:"#9c27b0"}}>{count("out_for_delivery")}</span>
          <span className="op-stat-lbl">🚚 Out for Delivery</span>
        </div>
        <div className="op-stat-divider" />
        <div className="op-stat-item">
          <span className="op-stat-val" style={{color:"#4caf50"}}>{count("delivered")}</span>
          <span className="op-stat-lbl">🎉 Delivered</span>
        </div>
        <div className="op-stat-divider" />
        <div className="op-stat-item">
          <span className="op-stat-val" style={{color:"#ff6b00"}}>₹{revenue.toLocaleString()}</span>
          <span className="op-stat-lbl">💰 Revenue</span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="op-table-wrap">
        {loading ? (
          <div className="op-empty"><span>⏳</span><p>Loading orders…</p></div>
        ) : filtered.length === 0 ? (
          <div className="op-empty"><span>📭</span><p>No orders found</p></div>
        ) : (
          <table className="op-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const opt = getStatusOpt(order.status);
                return (
                  <tr key={order.id} className="op-row">
                    <td><span className="op-id">#{order.shortId}</span></td>
                    <td>
                      <div className="op-customer">
                        <div className="op-avatar">{order.customer[0]}</div>
                        <div>
                          <div className="op-name">{order.customer}</div>
                          <div className="op-phone">{order.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="op-items">
                        {order.items.slice(0, 2).map((item, i) => (
                          <span key={i} className="op-item-pill">{item.qty}× {item.name}</span>
                        ))}
                        {order.items.length > 2 && (
                          <span className="op-item-pill more">+{order.items.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td><span className="op-amount">₹{order.amount}</span></td>
                    <td>
                      <span className={`op-payment ${order.payment === "COD" ? "cod" : "online"}`}>
                        {order.payment === "COD" ? "💵 COD" : "💳 Online"}
                      </span>
                    </td>
                    <td><span className="op-time">{order.time}</span></td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="op-status-wrap" style={{ "--sc": opt.color }}>
                        <select
                          className="op-status-select"
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>
                          ))}
                        </select>
                        <span className="op-status-arrow">▾</span>
                      </div>
                    </td>
                    <td>
                      <button className="op-view-btn" onClick={() => setSelectedOrder(order)}>
                        👁 View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal ── */}
      {selectedOrder && (
        <div className="op-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="op-modal" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="op-modal-header">
              <div className="op-modal-title">
                <span className="op-modal-icon">📦</span>
                <div>
                  <h2>Order Details</h2>
                  <span className="op-modal-id">#{selectedOrder.shortId}</span>
                </div>
              </div>
              <button className="op-modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            {/* Modal Body */}
            <div className="op-modal-body">

              {/* Row 1: Order Info + Customer */}
              <div className="op-modal-row2">
                <div className="op-modal-card">
                  <div className="op-modal-card-title">📋 Order Info</div>
                  <div className="op-kv"><span>Order ID</span><span className="op-kv-mono">{selectedOrder.shortId}</span></div>
                  <div className="op-kv">
                    <span>Status</span>
                    <span className="op-status-badge" style={{
                      color: getStatusOpt(selectedOrder.status).color,
                      borderColor: getStatusOpt(selectedOrder.status).color
                    }}>
                      {getStatusOpt(selectedOrder.status).emoji} {getStatusOpt(selectedOrder.status).label}
                    </span>
                  </div>
                  <div className="op-kv"><span>Payment</span><span>{selectedOrder.payment}</span></div>
                  <div className="op-kv"><span>Time</span><span>{selectedOrder.time}</span></div>
                </div>

                <div className="op-modal-card">
                  <div className="op-modal-card-title">👤 Customer</div>
                  <div className="op-kv"><span>Name</span><span>{selectedOrder.customer}</span></div>
                  <div className="op-kv"><span>Phone</span><span>{selectedOrder.phone}</span></div>
                  <div className="op-kv"><span>Email</span><span className="op-kv-wrap">{selectedOrder.email}</span></div>
                  <div className="op-kv"><span>Address</span><span className="op-kv-wrap">{selectedOrder.address}</span></div>
                </div>
              </div>

              {/* Row 2: Items */}
              <div className="op-modal-card">
                <div className="op-modal-card-title">🍽️ Items Ordered</div>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="op-modal-item">
                    <span className="op-modal-item-name">{item.name}</span>
                    <span className="op-modal-item-qty">× {item.qty}</span>
                    <span className="op-modal-item-price">₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div className="op-modal-total">
                  <span>Total</span>
                  <span>₹{selectedOrder.amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Row 3: Update Status */}
              <div className="op-modal-card">
                <div className="op-modal-card-title">🔄 Update Status</div>
                <div className="op-modal-status-wrap" style={{ "--sc": getStatusOpt(selectedOrder.status).color }}>
                  <select
                    className="op-modal-status-select"
                    value={selectedOrder.status}
                    onChange={e => updateStatus(selectedOrder.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.emoji} {opt.label}
                      </option>
                    ))}
                  </select>
                  <span className="op-modal-status-arrow">▾</span>
                </div>
                <p className="op-modal-status-hint">
                  Current: <strong style={{ color: getStatusOpt(selectedOrder.status).color }}>
                    {getStatusOpt(selectedOrder.status).emoji} {getStatusOpt(selectedOrder.status).label}
                  </strong>
                </p>
              </div>

              {/* Row 4: Print Label */}
              <button className="op-print-btn" onClick={() => printLabel(selectedOrder)}>
                🖨️ Print Package Label
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
