import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || '{"name":"Admin"}');
  const adminRole = localStorage.getItem("adminRole") || "admin";

  // Menu items with role-based visibility
  const menuItems = [
    { path: "/dashboard", icon: "📊", label: "Dashboard", roles: ["admin", "super_admin"] },
    { path: "/orders", icon: "📦", label: "Orders", roles: ["admin", "super_admin"] },
    { path: "/menu", icon: "🍔", label: "Menu", roles: ["admin", "super_admin"] },
    { path: "/admins", icon: "👨‍💼", label: "Admins", roles: ["super_admin"] },
    { path: "/users", icon: "👥", label: "Users", roles: ["super_admin"] },
    { path: "/settings", icon: "⚙️", label: "Settings", roles: ["admin", "super_admin"] },
  ];

  // Filter menu items based on role
  const visibleMenuItems = menuItems.filter(item => item.roles.includes(adminRole));

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>🍔 Hungry Hub</h2>
        <p>Admin Panel</p>
      </div>

      <nav className="sidebar-nav">
        {visibleMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-profile">
          <img 
            src={`https://ui-avatars.com/api/?name=${adminUser.name}&background=ff6b00&color=fff`}
            alt={adminUser.name}
            className="profile-avatar"
          />
          <div className="profile-info">
            <span className="profile-name">{adminUser.name}</span>
            <span className="profile-role">
              {adminRole === "super_admin" ? "Super Admin" : "Admin"}
            </span>
          </div>
        </div>
        
        <button className="btn-logout" onClick={handleLogout} title="Logout">
          ⏻
        </button>
      </div>
    </aside>
  );
}
