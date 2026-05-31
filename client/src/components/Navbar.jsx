import { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCart } from "../context/CartContext";
import "../styles/navbar.css";

const NAV_LINKS = [
  { label: "Home",     path: "/",        auth: null   },
  { label: "Menu",     path: "/menu",    auth: null   },
  { label: "Orders",   path: "/orders",  auth: true   },
  { label: "Wishlist", path: "/wishlist",auth: true   },
];

// Home page section anchors
const EXPLORE_LINKS = [
  { label: "🍽️ Featured Dishes",  id: "carousel" },
  { label: "🗂️ Categories",     id: "categories" },
  { label: "🍽️ Popular Dishes", id: "popular-dishes" },
  { label: "🔥 Special Offers", id: "special-offers" },
  { label: "🪜 How It Works",   id: "how-it-works" },
  { label: "📊 Stats",          id: "stats" },
  { label: "⭐ Testimonials",   id: "testimonials" },
  { label: "📱 App Download",   id: "app-download" },
  { label: "📧 Newsletter",     id: "newsletter" },
];

export default function Navbar({ search = "", onSearchChange }) {
  const navRef      = useRef(null);
  const inputRef    = useRef(null);
  const dropdownRef = useRef(null);
  const location    = useLocation();
  const navigate    = useNavigate();

  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef(null);

  const { totalItems } = useCart();

  // Get user from localStorage
  const [user,   setUser]   = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
      const av = localStorage.getItem("avatar");
      if (av) setAvatar(av);
    } catch {}
  }, []);

  const isMenu = location.pathname === "/menu";

  useGSAP(() => {
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-open search on menu page
  useEffect(() => {
    if (isMenu) setSearchOpen(true);
    else { setSearchOpen(false); onSearchChange?.(""); }
  }, [isMenu]);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [searchOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(e.target)) {
        setExploreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Animate dropdown
  useEffect(() => {
    if (!dropdownRef.current) return;
    const menu = dropdownRef.current.querySelector(".profile-dropdown");
    if (!menu) return;
    if (profileOpen) {
      gsap.fromTo(menu,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [profileOpen]);

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "POST", credentials: "include",
    });
    localStorage.removeItem("user");
    setProfileOpen(false);
    navigate("/login");
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  // Scroll to section on home page
  const scrollToSection = (id) => {
    setExploreOpen(false);
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav ref={navRef} className={`navbar ${scrolled ? "scrolled" : ""}`}>

      {/* Logo */}
      <Link to="/" className="nav-logo">
        <span className="nav-logo-icon">🍔</span>
        <span className="nav-logo-text">The Hungry Hub</span>
      </Link>

      {/* Desktop Links */}
      <ul className="nav-links">
        {NAV_LINKS.filter(link =>
          link.auth === null ||          // always visible
          (link.auth === true && user) || // only when logged in
          (link.auth === false && !user)  // only when logged out
        ).map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
            >
              {link.label}
            </Link>
          </li>
        ))}

        {/* Explore dropdown */}
        <li className="explore-wrap" ref={exploreRef}>
          <button
            className={`nav-link explore-btn ${exploreOpen ? "active" : ""}`}
            onClick={() => setExploreOpen(!exploreOpen)}
          >
            Explore ▾
          </button>
          {exploreOpen && (
            <div className="explore-dropdown">
              <p className="explore-dropdown-title">Jump to Section</p>
              {EXPLORE_LINKS.map((item) => (
                <button key={item.id} className="explore-item" onClick={() => scrollToSection(item.id)}>
                  {item.label}
                </button>
              ))}
              <div className="explore-divider" />
              <button className="explore-item explore-app-btn" onClick={() => scrollToSection("app-download")}>
                📱 Get the App
              </button>
            </div>
          )}
        </li>
      </ul>

      {/* Search Bar */}
      <div className={`nav-search-wrap ${searchOpen ? "open" : ""}`}>
        <span className="nav-search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="nav-search-input"
          placeholder="Search dishes, cuisines..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
        {search && (
          <button className="nav-search-clear" onClick={() => onSearchChange?.("")} aria-label="Clear">✕</button>
        )}
      </div>

      {/* Right Actions */}
      <div className="nav-actions">
        {/* Search toggle — non-menu pages */}
        {!isMenu && (
          <button
            className={`nav-search-btn ${searchOpen ? "active" : ""}`}
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            🔍
          </button>
        )}

        {/* Cart — only when logged in */}
        {user && (
          <Link to="/cart" className="nav-cart" aria-label="Cart">
            🛒 {totalItems > 0 && <span className="cart-badge">{totalItems > 99 ? "99+" : totalItems}</span>}
          </Link>
        )}

        {/* If NOT logged in: show Login + Register */}
        {!user && (
          <div className="nav-auth-btns">
            <Link to="/login" className="nav-login-btn">Login</Link>
            <Link to="/register" className="nav-register-btn">Sign Up</Link>
          </div>
        )}

        {/* Profile Avatar — only when logged in */}
        {user && (
          <div className="profile-wrap" ref={dropdownRef}>
            <button
              className="profile-avatar-btn"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="Profile menu"
            >
              <div className="profile-avatar">
                {avatar
                  ? <img src={avatar} alt="avatar" className="nav-avatar-img" />
                  : (user?.name ? getInitials(user.name) : "U")
                }
              </div>
              <span className="profile-chevron">{profileOpen ? "▲" : "▼"}</span>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <div className="profile-avatar-lg">
                    {avatar
                      ? <img src={avatar} alt="avatar" className="nav-avatar-img" />
                      : (user?.name ? getInitials(user.name) : "U")
                    }
                  </div>
                  <div>
                    <p className="profile-name">{user?.name || "Guest User"}</p>
                    <p className="profile-email">{user?.email || "Not logged in"}</p>
                  </div>
                </div>

                <div className="dropdown-divider" />

                <Link to="/profile"  className="dropdown-item" onClick={() => setProfileOpen(false)}><span>👤</span> My Profile</Link>
                <Link to="/orders"   className="dropdown-item" onClick={() => setProfileOpen(false)}><span>📦</span> My Orders</Link>
                <Link to="/cart"     className="dropdown-item" onClick={() => setProfileOpen(false)}><span>🛒</span> My Cart</Link>
                <Link to="/wishlist" className="dropdown-item" onClick={() => setProfileOpen(false)}><span>❤️</span> Wishlist</Link>

                <div className="dropdown-divider" />

                <Link to="/about"   className="dropdown-item" onClick={() => setProfileOpen(false)}><span>ℹ️</span> About Us</Link>
                <Link to="/contact" className="dropdown-item" onClick={() => setProfileOpen(false)}><span>📩</span> Contact</Link>

                <div className="dropdown-divider" />

                <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                  <span>🚪</span> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {isMenu && (
          <div className="mobile-search-wrap">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="mobile-search-input"
            />
          </div>
        )}
        {NAV_LINKS.filter(link =>
          link.auth === null ||
          (link.auth === true && user) ||
          (link.auth === false && !user)
        ).map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`mobile-link ${location.pathname === link.path ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        {!user ? (
          <div className="mobile-auth-btns">
            <Link to="/login"    className="nav-login-btn"    onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="nav-register-btn" onClick={() => setMenuOpen(false)}>Sign Up</Link>
          </div>
        ) : (
          <>
            <div className="mobile-profile-info">
              <span className="mobile-avatar">
                {avatar
                  ? <img src={avatar} alt="avatar" className="nav-avatar-img" />
                  : (user?.name ? getInitials(user.name) : "U")
                }
              </span>
              <span>{user?.name || "Guest"}</span>
            </div>
            <button className="mobile-logout" onClick={handleLogout}>🚪 Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
