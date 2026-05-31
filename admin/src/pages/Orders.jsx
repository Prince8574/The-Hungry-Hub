import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast from "react-hot-toast";
import axios from "axios";
import "../styles/orders.css";

const API_URL = "http://localhost:5000/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const statsRef = useRef([]);
  const navigate = useNavigate();

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        toast.error("Please login as admin");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/orders/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Transform backend data to match frontend format
      const transformedOrders = response.data.orders.map(order => ({
        id: order._id,
        customer: order.user?.name || "Guest",
        phone: order.user?.phone || "N/A",
        items: order.items.map(item => ({
          name: item.name,
          qty: item.qty,
          price: item.price
        })),
        amount: order.totalAmount,
        status: order.status === "out_for_delivery" ? "ready" : order.status, // Map out_for_delivery to ready for UI
        time: getTimeAgo(order.createdAt),
        address: `${order.deliveryAddress.line}, ${order.deliveryAddress.city}`,
        paymentMethod: order.paymentMethod === "cod" ? "Cash" : "Online"
      }));

      setOrders(transformedOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Please login as admin");
        navigate("/login");
      } else {
        toast.error("Failed to load orders");
      }
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds} secs ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  useGSAP(() => {
    gsap.fromTo(".page-header", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
    gsap.fromTo(".stat-box", 
      { opacity: 0, y: 30, scale: 0.9 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "back.out(1.7)" }
    );
    gsap.fromTo(".order-column", 
      { opacity: 0, x: -30 }, 
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, delay: 0.4, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    // Animate stat numbers
    statsRef.current.forEach((el, idx) => {
      if (el) {
        const target = parseInt(el.getAttribute('data-target'));
        gsap.to(el, {
          innerText: target,
          duration: 1.5,
          delay: 0.3 + idx * 0.1,
          snap: { innerText: 1 },
          ease: "power1.out"
        });
      }
    });
  }, [orders]);

  const moveOrder = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      
      // Map UI status to backend status
      const backendStatus = newStatus === "ready" ? "out_for_delivery" : newStatus;
      
      await axios.put(`${API_URL}/orders/${orderId}/status`, 
        { status: backendStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus, time: "Just now" } : order
      ));
      
      const statusEmojis = {
        preparing: "👨‍🍳 Preparing",
        ready: "✅ Ready for Pickup",
        delivered: "🎉 Delivered"
      };
      
      toast.success(`${statusEmojis[newStatus]}`, {
        icon: "🚀",
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #ff6b00',
        }
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const getOrdersByStatus = (status) => {
    let filtered = orders.filter(order => order.status === status);
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };
  
  const getStatusCount = (status) => orders.filter(o => o.status === status).length;
  const getTotalRevenue = () => orders.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="orders-page-new">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>📦 Orders Management</h1>
          <p>Real-time order tracking and management</p>
        </div>
        <div className="header-right">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search orders or customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-refresh-new" onClick={() => { fetchOrders(); toast.success("Orders refreshed!"); }}>
            🔄 Refresh
          </button>
          <button className="btn-filter-new">
            ⚙️ Filter
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-icon-circle">📊</div>
          <span className="stat-number" ref={el => statsRef.current[0] = el} data-target={orders.length}>0</span>
          <span className="stat-label">Total Orders</span>
        </div>
        <div className="stat-box">
          <div className="stat-icon-circle new">🔔</div>
          <span className="stat-number" ref={el => statsRef.current[1] = el} data-target={getStatusCount("pending")}>0</span>
          <span className="stat-label">New Orders</span>
        </div>
        <div className="stat-box">
          <div className="stat-icon-circle preparing">👨‍🍳</div>
          <span className="stat-number" ref={el => statsRef.current[2] = el} data-target={getStatusCount("preparing")}>0</span>
          <span className="stat-label">Preparing</span>
        </div>
        <div className="stat-box">
          <div className="stat-icon-circle ready">✅</div>
          <span className="stat-number" ref={el => statsRef.current[3] = el} data-target={getStatusCount("ready")}>0</span>
          <span className="stat-label">Ready</span>
        </div>
        <div className="stat-box highlight">
          <div className="stat-icon-circle revenue">💰</div>
          <span className="stat-number">₹{getTotalRevenue().toLocaleString()}</span>
          <span className="stat-label">Total Revenue</span>
          <span className="stat-trend">↗ +12% today</span>
        </div>
      </div>

      {/* Orders Container */}
      <div className="orders-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner">⏳</div>
            <p>Loading orders...</p>
          </div>
        ) : (
          <>
        {/* New Orders Column */}
        <div className="order-column new-orders">
          <div className="column-head">
            <div className="column-title">
              <span className="column-emoji">🔔</span>
              <h3>New Orders</h3>
            </div>
            <span className="count-badge pulse">{getStatusCount("pending")}</span>
          </div>
          <div className="column-content">
            {getOrdersByStatus("pending").length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>No new orders</p>
              </div>
            ) : (
              getOrdersByStatus("pending").map((order, idx) => (
                <div key={order.id} className="order-box" onClick={() => setSelectedOrder(order)} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="order-top">
                    <span className="order-id">{order.id}</span>
                    <span className="order-time">⏰ {order.time}</span>
                  </div>
                  <div className="order-customer-info">
                    <div className="avatar">{order.customer.charAt(0)}</div>
                    <div>
                      <h4>{order.customer}</h4>
                      <p>📞 {order.phone}</p>
                    </div>
                  </div>
                  <div className="order-items-list">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <span key={idx} className="item-pill">🍽️ {item.qty}x {item.name}</span>
                    ))}
                    {order.items.length > 2 && <span className="item-pill more">+{order.items.length - 2} more</span>}
                  </div>
                  <div className="order-bottom">
                    <span className="order-price">₹{order.amount}</span>
                    <button 
                      className="btn-action btn-accept"
                      onClick={(e) => { e.stopPropagation(); moveOrder(order.id, "preparing"); }}
                    >
                      ✓ Accept
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Preparing Column */}
        <div className="order-column preparing-orders">
          <div className="column-head">
            <div className="column-title">
              <span className="column-emoji">👨‍🍳</span>
              <h3>Preparing</h3>
            </div>
            <span className="count-badge">{getStatusCount("preparing")}</span>
          </div>
          <div className="column-content">
            {getOrdersByStatus("preparing").length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🍳</span>
                <p>No orders preparing</p>
              </div>
            ) : (
              getOrdersByStatus("preparing").map((order, idx) => (
                <div key={order.id} className="order-box preparing" onClick={() => setSelectedOrder(order)} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="order-top">
                    <span className="order-id">{order.id}</span>
                    <span className="order-time">⏰ {order.time}</span>
                  </div>
                  <div className="order-customer-info">
                    <div className="avatar preparing">{order.customer.charAt(0)}</div>
                    <div>
                      <h4>{order.customer}</h4>
                      <p>📞 {order.phone}</p>
                    </div>
                  </div>
                  <div className="order-items-list">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <span key={idx} className="item-pill">🍽️ {item.qty}x {item.name}</span>
                    ))}
                    {order.items.length > 2 && <span className="item-pill more">+{order.items.length - 2} more</span>}
                  </div>
                  <div className="order-bottom">
                    <span className="order-price">₹{order.amount}</span>
                    <button 
                      className="btn-action btn-ready"
                      onClick={(e) => { e.stopPropagation(); moveOrder(order.id, "ready"); }}
                    >
                      ✓ Ready
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ready Column */}
        <div className="order-column ready-orders">
          <div className="column-head">
            <div className="column-title">
              <span className="column-emoji">✅</span>
              <h3>Ready</h3>
            </div>
            <span className="count-badge">{getStatusCount("ready")}</span>
          </div>
          <div className="column-content">
            {getOrdersByStatus("ready").length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📦</span>
                <p>No orders ready</p>
              </div>
            ) : (
              getOrdersByStatus("ready").map((order, idx) => (
                <div key={order.id} className="order-box ready" onClick={() => setSelectedOrder(order)} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="order-top">
                    <span className="order-id">{order.id}</span>
                    <span className="order-time">⏰ {order.time}</span>
                  </div>
                  <div className="order-customer-info">
                    <div className="avatar ready">{order.customer.charAt(0)}</div>
                    <div>
                      <h4>{order.customer}</h4>
                      <p>📞 {order.phone}</p>
                    </div>
                  </div>
                  <div className="order-items-list">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <span key={idx} className="item-pill">🍽️ {item.qty}x {item.name}</span>
                    ))}
                    {order.items.length > 2 && <span className="item-pill more">+{order.items.length - 2} more</span>}
                  </div>
                  <div className="order-bottom">
                    <span className="order-price">₹{order.amount}</span>
                    <button 
                      className="btn-action btn-delivered"
                      onClick={(e) => { e.stopPropagation(); moveOrder(order.id, "delivered"); }}
                    >
                      🚚 Deliver
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Delivered Column */}
        <div className="order-column delivered-orders">
          <div className="column-head">
            <div className="column-title">
              <span className="column-emoji">🎉</span>
              <h3>Delivered</h3>
            </div>
            <span className="count-badge success">{getStatusCount("delivered")}</span>
          </div>
          <div className="column-content">
            {getOrdersByStatus("delivered").length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🎉</span>
                <p>No delivered orders</p>
              </div>
            ) : (
              getOrdersByStatus("delivered").map((order, idx) => (
                <div key={order.id} className="order-box completed" onClick={() => setSelectedOrder(order)} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="order-top">
                    <span className="order-id delivered">{order.id}</span>
                    <span className="order-time">⏰ {order.time}</span>
                  </div>
                  <div className="order-customer-info">
                    <div className="avatar delivered">{order.customer.charAt(0)}</div>
                    <div>
                      <h4>{order.customer}</h4>
                      <p>📞 {order.phone}</p>
                    </div>
                  </div>
                  <div className="order-bottom">
                    <span className="order-price">₹{order.amount}</span>
                    <span className="done-badge">✓ Completed</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        </>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-new" onClick={() => setSelectedOrder(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Order Details</h2>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className="modal-content">
              <div className="info-section">
                <h3>Order Info</h3>
                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                <p><strong>Status:</strong> <span className={`badge-${selectedOrder.status}`}>{selectedOrder.status}</span></p>
                <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
              </div>
              <div className="info-section">
                <h3>Customer</h3>
                <p><strong>Name:</strong> {selectedOrder.customer}</p>
                <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                <p><strong>Address:</strong> {selectedOrder.address}</p>
              </div>
              <div className="info-section">
                <h3>Items</h3>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="item-detail">
                    <span>{item.name}</span>
                    <span>x{item.qty}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
                <div className="total-line">
                  <strong>Total:</strong>
                  <strong>₹{selectedOrder.amount}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
