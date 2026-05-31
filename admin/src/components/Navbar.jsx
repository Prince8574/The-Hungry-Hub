import "../styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="admin-navbar">
      <div className="navbar-left">
        <h2>Welcome, Admin 👋</h2>
      </div>

      <div className="navbar-right">
        <button className="notification-btn">
          🔔
          <span className="notification-badge">3</span>
        </button>
      </div>
    </nav>
  );
}
