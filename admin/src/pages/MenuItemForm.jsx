import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import "../styles/menu-item-form.css";

const API_URL = "http://localhost:5000/api";

const CATEGORIES = ["Burgers", "Pizza", "Pasta", "Indian", "Sandwiches", "Asian", "Healthy", "Desserts", "Drinks"];

export default function MenuItemForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discount: "0",
    category: "Burgers",
    tag: "",
    description: "",
    image: "",
    isAvailable: true,
    stock: "100",
    inStock: true,
    preparationTime: "15",
    isVeg: false,
    spicyLevel: "0"
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (isEditMode) {
      fetchMenuItem();
    }
  }, [id]);

  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image);
    }
  }, [formData.image]);

  const fetchMenuItem = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_URL}/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const item = response.data.item;
      setFormData({
        name: item.name,
        price: item.price,
        discount: item.discount || "0",
        category: item.category,
        tag: item.tag || "",
        description: item.description || "",
        image: item.image || "",
        isAvailable: item.isAvailable,
        stock: item.stock || "100",
        inStock: item.inStock !== undefined ? item.inStock : true,
        preparationTime: item.preparationTime || "15",
        isVeg: item.isVeg || false,
        spicyLevel: item.spicyLevel || "0"
      });
    } catch (error) {
      console.error("Error fetching item:", error);
      toast.error("Failed to load item");
      navigate("/menu");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.description) {
      toast.error("Please fill all required fields!");
      return;
    }

    const token = localStorage.getItem("adminToken");

    if (!token) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      if (isEditMode) {
        await axios.put(`${API_URL}/menu/${id}`, formData, config);
        toast.success(`${formData.name} updated successfully! ✓`);
      } else {
        await axios.post(`${API_URL}/menu`, formData, config);
        toast.success(`${formData.name} added successfully! 🎉`);
      }

      navigate("/menu");
    } catch (error) {
      console.error("Error saving item:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again!");
        localStorage.removeItem("adminToken");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to save item");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="menu-item-form-page">
      <div className="form-header">
        <button className="back-btn" onClick={() => navigate("/menu")}>
          ← Back to Menu
        </button>
        <h1>{isEditMode ? "Edit Menu Item" : "Add New Menu Item"}</h1>
        <p>Fill in the details below to {isEditMode ? "update" : "create"} a menu item</p>
      </div>

      <form className="menu-form" onSubmit={handleSubmit}>
        {/* ROW 1: Image + Basic Info */}
        <div className="form-row-section">
          <div className="form-section-left">
            <h3 className="section-title">Item Image</h3>
            <div className="image-preview-container">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              ) : (
                <div className="image-placeholder">
                  <span className="placeholder-icon">🖼️</span>
                  <p>No image yet</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <label>Image URL *</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                required
              />
              <span className="field-hint">Paste an image URL from Unsplash or any CDN</span>
            </div>
          </div>

          <div className="form-section-right">
            <h3 className="section-title">Basic Information</h3>
            <div className="form-field">
              <label>Item Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Classic Smash Burger"
                required
              />
            </div>

            <div className="form-row three-cols">
              <div className="form-field">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="299"
                  required
                />
              </div>
              <div className="form-field">
                <label>Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
              <div className="form-field">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the item..."
                rows="3"
                required
              />
              <span className="field-hint">{formData.description.length} characters</span>
            </div>
          </div>
        </div>

        {/* ROW 2: Tag + Stock & Availability (4 columns) */}
        <div className="form-row-section-single">
          <h3 className="section-title-full">Additional Information</h3>
          <div className="form-grid-4">
            <div className="form-field">
              <label>Tag (Optional)</label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="Bestseller, New, Spicy"
              />
            </div>
            <div className="form-field">
              <label>Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="100"
                min="0"
              />
            </div>
            <div className="form-field">
              <label>Preparation Time (min)</label>
              <input
                type="number"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleChange}
                placeholder="15"
                min="0"
              />
            </div>
            <div className="form-field">
              <label>Availability</label>
              <select name="isAvailable" value={formData.isAvailable} onChange={(e) => setFormData({...formData, isAvailable: e.target.value === 'true'})}>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
          </div>
          
          {/* Tag Suggestions */}
          <div className="tag-suggestions-row">
            <span className="tag-label">Quick Tags:</span>
            {["Bestseller", "New", "Spicy 🌶️", "Popular", "Premium"].map(tag => (
              <button
                key={tag}
                type="button"
                className="tag-btn"
                onClick={() => setFormData({...formData, tag})}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ROW 3: Food Properties (2 columns) */}
        <div className="form-row-section-single">
          <h3 className="section-title-full">Food Properties</h3>
          <div className="form-row">
            <div className="form-field">
              <label>Food Type</label>
              <select name="isVeg" value={formData.isVeg} onChange={(e) => setFormData({...formData, isVeg: e.target.value === 'true'})}>
                <option value="false">Non-Vegetarian</option>
                <option value="true">Vegetarian</option>
              </select>
            </div>
            
            <div className="form-field">
              <label>Spicy Level</label>
              <select name="spicyLevel" value={formData.spicyLevel} onChange={handleChange}>
                <option value="0">Not Spicy</option>
                <option value="1">Mild</option>
                <option value="2">Medium</option>
                <option value="3">Hot</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate("/menu")}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Saving..." : isEditMode ? "Update Item" : "Add Item"}
          </button>
        </div>
      </form>
    </div>
  );
}
