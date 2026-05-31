import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

const RECENT_ORDERS = [
  { id: "ORD-001", customer: "Rahul Kumar", items: 3, amount: 899, status: "pending", time: "5 mins ago" },
  { id: "ORD-002", customer: "Priya Sharma", items: 2, amount: 649, status: "completed", time: "15 mins ago" },
  { id: "ORD-003", customer: "Amit Singh", items: 5, amount: 1299, status: "processing", time: "25 mins ago" },
  { id: "ORD-004", customer: "Sneha Patel", items: 4, amount: 1099, status: "pending", time: "35 mins ago" },
  { id: "ORD-005", customer: "Vikram Rao", items: 2, amount: 549, status: "completed", time: "1 hour ago" },
];

const TOP_ITEMS = [
  { name: "Classic Burger", orders: 45, revenue: 13455, trend: "+12%" },
  { name: "Margherita Pizza", orders: 38, revenue: 13262, trend: "+8%" },
  { name: "Butter Chicken", orders: 32, revenue: 9568, trend: "+15%" },
  { name: "Chocolate Cake", orders: 28, revenue: 4172, trend: "+5%" },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    todayOrders: 0,
    todayRevenue: 0,
  });

  useEffect(() => {
    // TODO: Fetch stats from API
    setStats({
      totalOrders: 156,
      pendingOrders: 12,
      totalRevenue: 45680,
      totalUsers: 89,
      todayOrders: 24,
      todayRevenue: 8450,
    });
  }, []);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, Admin! 👋</p>
        </div>
        <div className="header-actions">
          <button className="btn-refresh">🔄 Refresh</button>
          <button className="btn-export">📊 Export</button>
        </div>
      </div>

      {/* Main Stats - Horizontal Row */}
      <div className="stats-row">
        <div className="stat-card">
          <p className="stat-label">Total Orders</p>
          <div className="stat-main">
            <div className="stat-icon">📦</div>
            <h3 className="stat-number">{stats.totalOrders}</h3>
          </div>
          <span className="stat-change positive">+12% from last month</span>
        </div>

        <div className="stat-card stat-highlight">
          <p className="stat-label">Pending Orders</p>
          <div className="stat-main">
            <div className="stat-icon">⏳</div>
            <h3 className="stat-number">{stats.pendingOrders}</h3>
          </div>
          <span className="stat-change warning">Needs attention</span>
        </div>

        <div className="stat-card">
          <p className="stat-label">Total Revenue</p>
          <div className="stat-main">
            <div className="stat-icon">💰</div>
            <h3 className="stat-number">₹{stats.totalRevenue.toLocaleString()}</h3>
          </div>
          <span className="stat-change positive">+18% from last month</span>
        </div>

        <div className="stat-card">
          <p className="stat-label">Total Users</p>
          <div className="stat-main">
            <div className="stat-icon">👥</div>
            <h3 className="stat-number">{stats.totalUsers}</h3>
          </div>
          <span className="stat-change positive">+8% from last month</span>
        </div>
      </div>

      {/* Today's Performance - Compact Row */}
      <div className="today-stats">
        <h2 className="section-title">📅 Today's Performance</h2>
        <div className="today-row">
          <div className="today-item">
            <span className="today-icon">🛒</span>
            <div>
              <h4>{stats.todayOrders}</h4>
              <p>Orders Today</p>
            </div>
          </div>
          <div className="today-item">
            <span className="today-icon">💵</span>
            <div>
              <h4>₹{stats.todayRevenue.toLocaleString()}</h4>
              <p>Revenue Today</p>
            </div>
          </div>
          <div className="today-item">
            <span className="today-icon">⭐</span>
            <div>
              <h4>4.8</h4>
              <p>Avg Rating</p>
            </div>
          </div>
          <div className="today-item">
            <span className="today-icon">⚡</span>
            <div>
              <h4>28 min</h4>
              <p>Avg Delivery</p>
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
            {RECENT_ORDERS.map((order) => (
              <div key={order.id} className="order-item">
                <div className="order-left">
                  <span className="order-id">{order.id}</span>
                  <div className="order-customer">
                    <span className="customer-name">{order.customer}</span>
                    <span className="order-time">{order.time}</span>
                  </div>
                </div>
                <div className="order-right">
                  <span className="order-amount">₹{order.amount}</span>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">🔥 Top Selling Items</h2>
            <Link to="/menu" className="view-all-link">View Menu →</Link>
          </div>
          <div className="top-items-list">
            {TOP_ITEMS.map((item, index) => (
              <div key={index} className="top-item">
                <span className="item-rank">#{index + 1}</span>
                <div className="item-details">
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-stats">{item.orders} orders • ₹{item.revenue.toLocaleString()}</p>
                </div>
                <span className="item-trend positive">{item.trend}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions - Compact */}
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
          <Link to="/settings" className="action-btn">
            <span className="action-icon">⚙️</span>
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
