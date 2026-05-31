import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast from "react-hot-toast";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import "../styles/orders.css";

const API_URL = "http://localhost:5000/api";

const STATUS = {
  pending:          { label: "Pending",         color: "#f59e0b", bg: "rgba(245,158,11,0.15)", icon: "🕐" },
  confirmed:        { label: "Confirmed",        color: "#3b82f6", bg: "rgba(59,130,246,0.15)", icon: "✅" },
  preparing:        { label: "Preparing",        color: "#a855f7", bg: "rgba(168,85,247,0.15)", icon: "👨‍🍳" },
  out_for_delivery: { label: "Out for Delivery", color: "#ff6b00", bg: "rgba(255,107,0,0.15)",  icon: "🛵" },
  delivered:        { label: "Delivered",        color: "#22c55e", bg: "rgba(34,197,94,0.15)",  icon: "🎉" },
  cancelled:        { label: "Cancelled",        color: "#ef4444", bg: "rgba(239,68,68,0.15)",  icon: "✕"  },
  Delivered:        { label: "Delivered",        color: "#22c55e", bg: "rgba(34,197,94,0.15)",  icon: "🎉" },
  Cancelled:        { label: "Cancelled",        color: "#ef4444", bg: "rgba(239,68,68,0.15)",  icon: "✕"  },
  Pending:          { label: "Pending",          color: "#f59e0b", bg: "rgba(245,158,11,0.15)", icon: "🕐" },
};

const PAYMENT_LABEL = {
  cod: "Cash on Delivery", upi: "UPI", card: "Card",
  wallet: "Wallet", netbank: "Net Banking", online: "Online",
};

const FILTERS = ["All", "Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

const TIMELINE_STEPS = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
const STATUS_ORDER   = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

// ─────────────────────────────────────────────
// Order Detail Modal
// ─────────────────────────────────────────────
function OrderDetailModal({ order, onClose, onReorder, onCancel }) {
  const s = STATUS[order.status] || STATUS.pending;
  const canCancel = ["pending", "confirmed", "Pending"].includes(order.status);
  const currentIdx = STATUS_ORDER.indexOf((order.status || "").toLowerCase());
  const isCancelled = ["cancelled", "Cancelled"].includes(order.status);

  useEffect(() => {
    gsap.fromTo(".od-modal",
      { opacity: 0, y: 30, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" }
    );
  }, []);

  return createPortal(
    <div className="od-overlay" onClick={onClose}>
      <div className="od-modal" onClick={e => e.stopPropagation()}>

        {/* Top accent bar */}
        <div className="od-top-bar" style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }} />

        {/* Header */}
        <div className="od-header">
          <div className="od-header-left">
            <span className="od-status-badge" style={{ background: s.bg, color: s.color }}>
              <span>{s.icon}</span> {s.label}
            </span>
            <p className="od-order-id">{order.id}</p>
            <p className="od-date">🗓 {order.date}</p>
          </div>
          <button className="od-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Timeline */}
        {!isCancelled && (
          <div className="od-timeline-wrap">
            <div className="od-timeline">
              {TIMELINE_STEPS.map((step, i) => {
                const st = STATUS[step];
                const stepIdx = STATUS_ORDER.indexOf(step);
                const isDone = !isCancelled && currentIdx >= stepIdx;
                const isActive = currentIdx === stepIdx;
                return (
                  <div key={step} className="od-tl-step">
                    <div className={`od-tl-dot ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}>
                      {isDone ? "✓" : st.icon}
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div className={`od-tl-line ${isDone && currentIdx > stepIdx ? "done" : ""}`} />
                    )}
                    <span className={`od-tl-label ${isDone ? "done" : ""}`}>{st.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="od-section-label">🛍️ Items Ordered</div>
        <div className="od-items">
          {order.items.map((item, i) => (
            <div className="od-item" key={i}>
              {item.img
                ? <img src={item.img} alt={item.name} className="od-item-img" />
                : <div className="od-item-img od-item-emoji">{item.image || "🍽️"}</div>
              }
              <div className="od-item-info">
                <span className="od-item-name">{item.name}</span>
                <span className="od-item-qty">Qty: {item.qty}</span>
              </div>
              <span className="od-item-price">₹{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Address */}
        {order.deliveryAddress && (
          <>
            <div className="od-section-label">📍 Delivery Address</div>
            <div className="od-addr-box">
              <p>{order.deliveryAddress.line}</p>
              <p>{order.deliveryAddress.city}{order.deliveryAddress.pincode ? `, ${order.deliveryAddress.pincode}` : ""}</p>
            </div>
          </>
        )}

        {/* Summary */}
        <div className="od-summary">
          <div className="od-summary-row">
            <span>Payment Method</span>
            <span>{PAYMENT_LABEL[order.paymentMethod] || order.paymentMethod || "—"}</span>
          </div>
          <div className="od-summary-row od-total-row">
            <span>Total Paid</span>
            <span className="od-total-val">₹{(order.total || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="od-actions">
          {canCancel && (
            <button className="od-cancel-btn" onClick={() => onCancel(order.id)}>
              ✕ Cancel Order
            </button>
          )}
          <button className="od-reorder-btn" onClick={() => onReorder(order)}>
            🔄 Reorder
          </button>
          <button className="od-close-btn" onClick={onClose}>Close</button>
        </div>

      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────
// Main Orders Page
// ─────────────────────────────────────────────
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [detailOrder, setDetailOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Please login to view orders");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Transform backend data to match frontend format
      const transformedOrders = response.data.orders.map(order => {
        // Create short order ID (last 8 characters)
        const shortId = `#${order._id.slice(-8).toUpperCase()}`;
        
        // Format time as "X mins ago" or "X hours ago"
        const orderTime = new Date(order.createdAt);
        const now = new Date();
        const diffMs = now - orderTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        let timeAgo;
        if (diffMins < 1) {
          timeAgo = "Just now";
        } else if (diffMins < 60) {
          timeAgo = `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
          timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
          timeAgo = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
          timeAgo = orderTime.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
          });
        }
        
        return {
          id: shortId,
          fullId: order._id,
          items: order.items.map(item => ({
            name: item.name,
            img: item.image,
            image: item.image,
            price: item.price,
            qty: item.qty
          })),
          total: order.totalAmount,
          status: order.status,
          date: orderTime.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          timeAgo: timeAgo,
          paymentMethod: order.paymentMethod,
          deliveryAddress: order.deliveryAddress
        };
      });

      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to view orders");
        navigate("/login");
      } else {
        toast.error("Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  useGSAP(() => {
    gsap.fromTo(".orders-hero-content",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  useEffect(() => {
    gsap.fromTo(".order-card",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power3.out" }
    );
  }, [orders, filter]);

  const filtered = orders.filter(o => {
    if (filter === "All") return true;
    return STATUS[o.status]?.label?.toLowerCase() === filter.toLowerCase();
  });

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem("token");
      // Find the full ID from the order
      const order = orders.find(o => o.id === id);
      const fullId = order?.fullId || id;
      
      await axios.put(`${API_URL}/orders/${fullId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      const updated = orders.map(o => o.id === id ? { ...o, status: "cancelled" } : o);
      setOrders(updated);
      setDetailOrder(null);
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const handleReorder = (order) => {
    order.items.forEach(item => addToCart(item));
    setDetailOrder(null);
    toast.success("Items added to cart 🛒");
    navigate("/cart");
  };

  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);
  const deliveredCount = orders.filter(o => ["delivered", "Delivered"].includes(o.status)).length;

  return (
    <div className="orders-page">
      <Navbar />

      {/* ── HERO ── */}
      <section className="orders-hero">
        <div className="orders-hero-glow" />
        <div className="orders-hero-content">
          <div className="orders-hero-left">
            <span className="orders-hero-tag">📦 My Orders</span>
            <h1 className="orders-title">
              Order <span className="text-orange">History</span>
            </h1>
            <p className="orders-sub">
              {orders.length > 0
                ? `${orders.length} order${orders.length !== 1 ? "s" : ""} placed so far`
                : "Your orders will appear here"}
            </p>
          </div>

          {orders.length > 0 && null}
        </div>
      </section>

      {/* ── FILTERS ── */}
      {orders.length > 0 && (
        <div className="orders-filters-wrap">
          <div className="orders-filters">
            {FILTERS.map(f => {
              const count = f === "All"
                ? orders.length
                : orders.filter(o => STATUS[o.status]?.label?.toLowerCase() === f.toLowerCase()).length;
              return (
                <button
                  key={f}
                  className={`orders-filter-btn ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                  <span className="orders-filter-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── BODY ── */}
      <section className="orders-body">
        {loading ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">⏳</div>
            <h3 className="orders-empty-title">Loading orders...</h3>
          </div>
        ) : orders.length === 0 ? (
          /* Empty state */
          <div className="orders-empty">
            <div className="orders-empty-blob" />
            <div className="orders-empty-icon">🛵</div>
            <h3 className="orders-empty-title">No orders yet</h3>
            <p className="orders-empty-sub">
              Looks like you haven't ordered anything yet.<br />
              Explore our menu and place your first order!
            </p>
            <Link to="/menu" className="orders-empty-btn">
              Browse Menu 🍽️
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">🔍</div>
            <h3 className="orders-empty-title">No {filter} orders</h3>
            <p className="orders-empty-sub">You don't have any {filter.toLowerCase()} orders yet.</p>
          </div>
        ) : (
          <div className="orders-list">
            {filtered.map((order, i) => {
              const s = STATUS[order.status] || STATUS.pending;
              return (
                <div className="order-card" key={order.id || i}>
                  <div className="order-card-body">

                    {/* Left: image + info */}
                    <div className="order-left">
                      {order.items[0]?.img
                        ? <img src={order.items[0].img} alt={order.items[0].name} className="order-thumb" />
                        : <div className="order-thumb order-thumb-emoji">{order.items[0]?.image || "🍽️"}</div>
                      }
                      <div className="order-info">
                        <span className="order-id">{order.id}</span>
                        <span className="order-items-text">
                          {order.items.map(i => i.name).join(", ")}
                        </span>
                        <span className="order-date">🕐 {order.timeAgo}</span>
                      </div>
                    </div>

                    {/* Right: status + price + actions */}
                    <div className="order-right">
                      <span className="order-status-pill" style={{ background: s.bg, color: s.color }}>
                        {s.icon} {s.label}
                      </span>
                      <span className="order-price">₹{(order.total || 0).toLocaleString()}</span>
                      <div className="order-action-btns">
                        <button className="order-btn-reorder" onClick={() => handleReorder(order)}>Reorder</button>
                        <button className="order-btn-detail" onClick={() => setDetailOrder(order)}>Details</button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          onClose={() => setDetailOrder(null)}
          onReorder={handleReorder}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
