import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/dashboard.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STATUS_COLOR = {
  pending:          "#ffc107",
  confirmed:        "#2196f3",
  preparing:        "#ff9800",
  out_for_delivery: "#9c27b0",
  delivered:        "#4caf50",
  cancelled:        "#f44336",
};

export default function Dashboard() {
  const [stats, setStats]               = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topItems, setTopItems]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.stats);
      setRecentOrders(res.data.recentOrders);
      setTopItems(res.data.topItems);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dash-loading">
          <div className="dash-spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const hr = new Date().getHours();
  const greet = hr < 12 ? "Good Morning" : hr < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">{greet}, {adminUser.name || "Admin"}! 👋</p>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={() => { fetchDashboard(); toast.success("Refreshed!"); }}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <p className="stat-label">Total Orders</p>
          <div className="stat-main">
            <div className="stat-icon">📦</div>
            <h3 className="stat-number">{stats?.totalOrders ?? 0}</h3>
          </div>
          <span className="stat-change positive">All time</span>
        </div>

        <div className="stat-card stat-highlight">
          <p className="stat-label">Active Orders</p>
          <div className="stat-main">
            <div className="stat-icon">⏳</div>
            <h3 className="stat-number">{stats?.pendingOrders ?? 0}</h3>
          </div>
          <span className="stat-change warning">
            {stats?.pendingOrders > 0 ? "Needs attention" : "All clear ✅"}
          </span>
        </div>

        <div className="stat-card">
          <p className="stat-label">Total Revenue</p>
          <div className="stat-main">
            <div className="stat-icon">💰</div>
            <h3 className="stat-number">₹{(stats?.totalRevenue ?? 0).toLocaleString()}</h3>
          </div>
          <span className="stat-change positive">All time</span>
        </div>

        <div className="stat-card">
          <p className="stat-label">Total Customers</p>
          <div className="stat-main">
            <div className="stat-icon">👥</div>
            <h3 className="stat-number">{stats?.totalUsers ?? 0}</h3>
          </div>
          <span className="stat-change positive">Registered users</span>
        </div>
      </div>

      {/* Today's Performance */}
      <div className="today-stats">
        <h2 className="section-title">📅 Today's Performance</h2>
        <div className="today-row">
          <div className="today-item">
            <span className="today-icon">🛒</span>
            <div>
              <h4>{stats?.todayOrders ?? 0}</h4>
              <p>Orders Today</p>
            </div>
          </div>
          <div className="today-item">
            <span className="today-icon">💵</span>
            <div>
              <h4>₹{(stats?.todayRevenue ?? 0).toLocaleString()}</h4>
              <p>Revenue Today</p>
            </div>
          </div>
          <div className="today-item">
            <span className="today-icon">🍽️</span>
            <div>
              <h4>{stats?.totalMenuItems ?? 0}</h4>
              <p>Menu Items</p>
            </div>
          </div>
          <div className="today-item">
            <span className="today-icon">🎉</span>
            <div>
              <h4>{stats?.deliveredOrders ?? 0}</h4>
              <p>Delivered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-grid">

        {/* Recent Orders */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">📦 Recent Orders</h2>
            <Link to="/orders" className="view-all-link">View All →</Link>
          </div>
          <div className="orders-list">
            {recentOrders.length === 0 ? (
              <div className="dash-empty">No orders yet</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="order-item">
                  <div className="order-left">
                    <span className="order-id">#{order.id}</span>
                    <div className="order-customer">
                      <span className="customer-name">{order.customer}</span>
                      <span className="order-time">{order.time}</span>
                    </div>
                  </div>
                  <div className="order-right">
                    <span className="order-amount">₹{order.amount?.toLocaleString()}</span>
                    <span className="status-badge" style={{
                      color: STATUS_COLOR[order.status] || "#aaa",
                      borderColor: STATUS_COLOR[order.status] || "#aaa",
                      background: "transparent",
                      border: "1px solid",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                    }}>
                      {order.status?.replace("_"," ")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">🔥 Top Selling Items</h2>
            <Link to="/menu" className="view-all-link">View Menu →</Link>
          </div>
          <div className="top-items-list">
            {topItems.length === 0 ? (
              <div className="dash-empty">No data yet</div>
            ) : (
              topItems.map((item, index) => (
                <div key={index} className="top-item">
                  <span className="item-rank">#{index + 1}</span>
                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-stats">{item.orders} orders • ₹{item.revenue?.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title">⚡ Quick Actions</h2>
        <div className="actions-row">
          <Link to="/orders" className="action-btn">
            <span className="action-icon">📦</span>
            <span>Orders</span>
          </Link>
          <Link to="/menu/add" className="action-btn">
            <span className="action-icon">🍔</span>
            <span>Add Item</span>
          </Link>
          <Link to="/menu" className="action-btn">
            <span className="action-icon">📋</span>
            <span>Menu</span>
          </Link>
          <Link to="/admins" className="action-btn">
            <span className="action-icon">👥</span>
            <span>Admins</span>
          </Link>
          <Link to="/settings" className="action-btn">
            <span className="action-icon">⚙️</span>
            <span>Settings</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
