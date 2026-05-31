import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import "../styles/menu-management.css";

const CATEGORIES = ["All", "Burgers", "Pizza", "Pasta", "Indian", "Sandwiches", "Asian", "Healthy", "Desserts", "Drinks"];

const API_URL = "http://localhost:5000/api";

export default function MenuManagement() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [stockFilter, setStockFilter] = useState("all");
  const statsRef = useRef([]);

  // Form data removed - now handled in MenuItemForm page

  // Fetch menu items from backend
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_URL}/menu/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Fetched menu items:", response.data.items);
      setMenuItems(response.data.items || []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      
      // Check if token expired
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again!");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return;
      }
      
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useGSAP(() => {
    gsap.fromTo(".page-header", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
    gsap.fromTo(".stat-card-menu", 
      { opacity: 0, y: 30, scale: 0.9 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "back.out(1.7)" }
    );
    
    // Only animate menu cards if they exist
    const menuCards = document.querySelectorAll(".menu-item-card");
    if (menuCards.length > 0) {
      gsap.fromTo(".menu-item-card", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, delay: 0.3, ease: "power2.out" }
      );
    }
  }, [activeCategory, viewMode, menuItems]);

  useEffect(() => {
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
  }, [menuItems]);

  const getFilteredItems = () => {
    let filtered = menuItems;
    
    // Category filter
    if (activeCategory !== "All") {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Stock filter
    if (stockFilter === "inStock") {
      filtered = filtered.filter(item => item.inStock !== false);
    } else if (stockFilter === "outOfStock") {
      filtered = filtered.filter(item => item.inStock === false);
    }
    
    console.log("Filtered items:", filtered.length, filtered);
    return filtered;
  };

  const getTotalItems = () => menuItems.length;
  const getActiveItems = () => menuItems.filter(i => i.isAvailable).length;
  const getInactiveItems = () => menuItems.filter(i => !i.isAvailable).length;
  const getLowStockItems = () => menuItems.filter(i => (i.stock || 0) < 10).length;

  const openAddModal = () => {
    navigate("/menu/add");
  };

  const openEditModal = (item) => {
    navigate(`/menu/edit/${item._id}`);
  };

  // handleSubmit removed - now handled in MenuItemForm page

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`${API_URL}/menu/${item._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(`${item.name} deleted!`, {
          icon: "🗑️",
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ff6b00' }
        });
        fetchMenuItems(); // Refresh list
      } catch (error) {
        console.error("Error deleting menu item:", error);
        toast.error("Failed to delete menu item");
      }
    }
  };

  const toggleStatus = async (item) => {
    try {
      const token = localStorage.getItem("adminToken");
      const newStatus = !item.isAvailable;
      
      await axios.put(`${API_URL}/menu/${item._id}`, 
        { isAvailable: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      toast.success(`${item.name} is now ${newStatus ? 'available' : 'unavailable'}!`, {
        icon: newStatus ? "✓" : "⏸️",
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ff6b00' }
      });
      fetchMenuItems(); // Refresh list
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    }
  };

  const toggleStockStatus = async (item) => {
    try {
      const token = localStorage.getItem("adminToken");
      const newStockStatus = !item.inStock;
      
      await axios.put(`${API_URL}/menu/${item._id}`, 
        { inStock: newStockStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      toast.success(`${item.name} is now ${newStockStatus ? 'in stock' : 'out of stock'}!`, {
        icon: newStockStatus ? "✅" : "❌",
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ff6b00' }
      });
      fetchMenuItems(); // Refresh list
    } catch (error) {
      console.error("Error toggling stock status:", error);
      toast.error("Failed to update stock status");
    }
  };

  const handleDuplicate = async (item) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(`${API_URL}/menu/${item._id}/duplicate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${item.name} duplicated!`, {
        icon: "📋",
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ff6b00' }
      });
      fetchMenuItems();
    } catch (error) {
      console.error("Error duplicating item:", error);
      toast.error("Failed to duplicate item");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to delete");
      return;
    }

    if (window.confirm(`Delete ${selectedItems.length} selected items?`)) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.post(`${API_URL}/menu/bulk-delete`, 
          { ids: selectedItems },
          { headers: { Authorization: `Bearer ${token}` }}
        );
        toast.success(`${selectedItems.length} items deleted!`, {
          icon: "🗑️",
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ff6b00' }
        });
        setSelectedItems([]);
        fetchMenuItems();
      } catch (error) {
        console.error("Error bulk deleting:", error);
        toast.error("Failed to delete items");
      }
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item._id));
    }
  };

  const exportMenu = (format) => {
    const dataStr = format === 'json' 
      ? JSON.stringify(menuItems, null, 2)
      : convertToCSV(menuItems);
    
    const dataBlob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `menu-${new Date().toISOString().split('T')[0]}.${format}`;
    link.click();
    toast.success(`Menu exported as ${format.toUpperCase()}!`);
  };

  const convertToCSV = (data) => {
    const headers = ['Name', 'Price', 'Category', 'Description', 'Stock', 'In Stock', 'Available'];
    const rows = data.map(item => [
      item.name,
      item.price,
      item.category,
      item.description,
      item.stock || 0,
      item.inStock ? 'Yes' : 'No',
      item.isAvailable ? 'Yes' : 'No'
    ]);
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="menu-management-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>🍽️ Menu Management</h1>
          <p>Manage your restaurant menu items</p>
        </div>
        <div className="header-right">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search menu items..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Export Dropdown */}
          <div className="export-dropdown">
            <button className="btn-export">
              📥 Export
            </button>
            <div className="export-menu">
              <button onClick={() => exportMenu('json')}>📄 Export as JSON</button>
              <button onClick={() => exportMenu('csv')}>📊 Export as CSV</button>
            </div>
          </div>
          
          <button className="btn-add-new" onClick={openAddModal}>
            ➕ Add New Item
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row-menu">
        <div className="stat-card-menu">
          <div className="stat-icon-circle">📊</div>
          <span className="stat-number" ref={el => statsRef.current[0] = el} data-target={getTotalItems()}>0</span>
          <span className="stat-label">Total Items</span>
        </div>
        <div className="stat-card-menu">
          <div className="stat-icon-circle active">✓</div>
          <span className="stat-number" ref={el => statsRef.current[1] = el} data-target={getActiveItems()}>0</span>
          <span className="stat-label">Active Items</span>
        </div>
        <div className="stat-card-menu">
          <div className="stat-icon-circle inactive">⏸️</div>
          <span className="stat-number" ref={el => statsRef.current[2] = el} data-target={getInactiveItems()}>0</span>
          <span className="stat-label">Inactive Items</span>
        </div>
        <div className="stat-card-menu">
          <div className="stat-icon-circle warning">⚠️</div>
          <span className="stat-number" ref={el => statsRef.current[3] = el} data-target={getLowStockItems()}>0</span>
          <span className="stat-label">Low Stock</span>
        </div>
      </div>

      {/* Single Row Controls */}
      <div className="menu-controls-row">
        <div className="category-pills">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {cat !== "All" && (
                <span className="cat-count">
                  {menuItems.filter(i => i.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <div className="controls-right">
          {/* Stock Filter */}
          <select 
            className="filter-dropdown"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">📦 All Stock</option>
            <option value="inStock">✅ In Stock</option>
            <option value="outOfStock">❌ Out of Stock</option>
          </select>
          
          {/* View Mode */}
          <select 
            className="filter-dropdown"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="grid">⊞ Grid View</option>
            <option value="table">☰ Table View</option>
          </select>
        </div>
      </div>

      {/* Menu Items Display */}
      {viewMode === "grid" ? (
        <div className="menu-grid-view">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🍽️</span>
              <p>No menu items found</p>
              <button className="btn-add-first" onClick={openAddModal}>Add Your First Item</button>
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div key={item._id} className="menu-item-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="item-img-wrapper">
                  <img src={item.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&auto=format"} alt={item.name} className="item-img" />
                  
                  {/* VEG/NON-VEG Icon - Top Left */}
                  <span 
                    className={`food-type-icon ${item.isVeg ? 'veg' : 'non-veg'}`}
                    title={item.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                  ></span>
                  
                  {/* Out of Stock Corner Badge */}
                  {item.inStock === false && (
                    <div className="corner-ribbon">
                      <span>OUT OF STOCK</span>
                    </div>
                  )}
                </div>
                
                <div className="item-content">
                  <div className="item-header">
                    <div className="item-name-wrapper">
                      <h3 className="item-name">{item.name}</h3>
                    </div>
                    <span className="item-rating">
                      <span className="rating-star">★</span>
                      {item.rating || 4.5}
                    </span>
                  </div>

                  <p className="item-desc">{item.description}</p>

                  {/* Badges Row - After Description */}
                  <div className="item-badges">
                    <span className={`badge-status ${item.isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                    {item.tag && <span className="badge-tag">{item.tag}</span>}
                  </div>
                  
                  <div className="item-category-row">
                    <span className="category-label">Category:</span>
                    <span className="category-text">{item.category}</span>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="item-meta">
                    <span className="meta-item">
                      <span className="meta-label">Prep Time:</span>
                      <span className="meta-value">{item.preparationTime || 15} min</span>
                    </span>
                    {item.spicyLevel > 0 && (
                      <span className="meta-item">
                        <span className="meta-label">Spicy:</span>
                        <span className="meta-value">Level {item.spicyLevel}</span>
                      </span>
                    )}
                    <span className="meta-item">
                      <span className="meta-label">Stock:</span>
                      <span className="meta-value">{item.stock || 0}</span>
                    </span>
                  </div>
                  
                  <div className="item-footer">
                    <div className="item-left">
                      {item.discount > 0 ? (
                        <>
                          <span className="item-price-original">₹{item.price}</span>
                          <span className="item-price">₹{Math.round(item.price * (1 - item.discount / 100))}</span>
                          <span className="item-discount">{item.discount}% OFF</span>
                        </>
                      ) : (
                        <span className="item-price">₹{item.price}</span>
                      )}
                    </div>
                    <div className="item-actions">
                      <button 
                        className={`btn-action btn-stock ${item.inStock === false ? 'out-of-stock' : 'in-stock'}`}
                        onClick={() => toggleStockStatus(item)}
                        title={item.inStock === false ? "Mark In Stock" : "Mark Out of Stock"}
                      >
                        {item.inStock === false ? "Out" : "In"}
                      </button>
                      <button 
                        className="btn-action btn-edit" 
                        onClick={() => openEditModal(item)}
                        title="Edit Item"
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-action btn-toggle" 
                        onClick={() => toggleStatus(item)}
                        title={item.isAvailable ? "Mark Unavailable" : "Mark Available"}
                      >
                        {item.isAvailable ? "Hide" : "Show"}
                      </button>
                      <button 
                        className="btn-action btn-delete" 
                        onClick={() => handleDelete(item)}
                        title="Delete Item"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="menu-table-view">
          <table className="menu-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item._id}>
                  <td>
                    <img src={item.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&auto=format"} alt={item.name} className="table-img" />
                  </td>
                  <td className="table-name">{item.name}</td>
                  <td>{item.category}</td>
                  <td className="table-price">₹{item.price}</td>
                  <td>⭐ {item.rating || 4.5}</td>
                  <td>
                    <span className={`status-badge-table ${item.isAvailable ? 'active' : 'inactive'}`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon btn-edit" onClick={() => openEditModal(item)}>✏️</button>
                      <button className="btn-icon btn-toggle" onClick={() => toggleStatus(item)}>
                        {item.isAvailable ? "⏸️" : "▶️"}
                      </button>
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(item)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
