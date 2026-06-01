import { Outlet, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Layout.css";

export default function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("deliveryUser") || "{}");

  const logout = () => {
    localStorage.removeItem("deliveryToken");
    localStorage.removeItem("deliveryUser");
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="dp-layout">
      <aside className="dp-sidebar">
        <div className="dp-logo">
          <span className="dp-logo-icon">🍔</span>
          <div>
            <div className="dp-logo-text">Hungry Hub</div>
            <div className="dp-logo-sub">Delivery Panel</div>
          </div>
        </div>
        <nav className="dp-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `dp-nav-item ${isActive ? "active" : ""}`}>
            <span>📊</span><span className="dp-nav-label">Dashboard</span>
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => `dp-nav-item ${isActive ? "active" : ""}`}>
            <span>📦</span><span className="dp-nav-label">Orders</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `dp-nav-item ${isActive ? "active" : ""}`}>
            <span>👤</span><span className="dp-nav-label">Profile</span>
          </NavLink>
        </nav>
        <div className="dp-sidebar-footer">
          <div className="dp-user-info">
            <div className="dp-user-avatar">{user.name?.[0] || "D"}</div>
            <div className="dp-user-details">
              <div className="dp-user-name">{user.name || "Delivery Boy"}</div>
              <div className="dp-user-role">Delivery Partner</div>
            </div>
          </div>
          <button className="dp-logout" onClick={logout} title="Logout">⏻</button>
        </div>
      </aside>
      <main className="dp-main"><Outlet /></main>
    </div>
  );
}
