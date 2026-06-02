import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./Offers.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const EMPTY = {
  title: "", description: "", code: "", badge: "", badgeLabel: "",
  discountType: "percent", discountValue: 0, minOrder: 0,
  validTill: "Limited time", bgColor: "#2a1a0a", sortOrder: 0, isActive: true,
};

export default function Offers() {
  const [offers, setOffers]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);

  useEffect(() => { fetchOffers(); }, []);

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API}/offers/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(res.data.offers || []);
    } catch { toast.error("Failed to load offers"); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.code) { toast.error("Title and code required"); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const url    = editing ? `${API}/offers/${editing._id}` : `${API}/offers`;
      const method = editing ? "put" : "post";
      await axios[method](url, { ...form, code: form.code.toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success(editing ? "Offer updated!" : "Offer created!");
      closeForm(); fetchOffers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this offer?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API}/offers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Offer deleted");
      fetchOffers();
    } catch { toast.error("Failed to delete"); }
  };

  const toggleActive = async (offer) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`${API}/offers/${offer._id}`, { isActive: !offer.isActive },
        { headers: { Authorization: `Bearer ${token}` } });
      fetchOffers();
    } catch { toast.error("Failed to update"); }
  };

  const openEdit = (offer) => {
    setEditing(offer);
    setForm({ ...offer });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false); setEditing(null); setForm(EMPTY);
  };

  return (
    <div className="of-page">
      <div className="of-header">
        <div>
          <h1>🎁 Offers & Deals</h1>
          <p>Manage special offers and coupon codes shown on client</p>
        </div>
        <button className="of-add-btn" onClick={() => setShowForm(true)}>+ Add Offer</button>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div className="of-empty">⏳ Loading...</div>
      ) : offers.length === 0 ? (
        <div className="of-empty"><span>🎁</span><p>No offers yet</p></div>
      ) : (
        <div className="of-grid">
          {offers.map(offer => (
            <div key={offer._id} className={`of-card ${!offer.isActive ? "inactive" : ""}`}
              style={{ background: offer.bgColor || "#2a1a0a" }}>
              <div className="of-card-top">
                {offer.badgeLabel && <span className="of-badge-label">{offer.badgeLabel}</span>}
                {offer.badge && (
                  <div className="of-badge">{offer.badge}</div>
                )}
              </div>
              <h3 className="of-title">{offer.title}</h3>
              <p className="of-desc">{offer.description}</p>
              <div className="of-code-row">
                <span>Use code:</span>
                <span className="of-code">{offer.code}</span>
                <span className="of-validity">⏰ {offer.validTill}</span>
              </div>
              <div className="of-meta">
                {offer.discountType === "percent" && <span>💰 {offer.discountValue}% off</span>}
                {offer.discountType === "flat"    && <span>💰 ₹{offer.discountValue} off</span>}
                {offer.discountType === "free_delivery" && <span>🚚 Free delivery</span>}
                {offer.minOrder > 0 && <span>Min: ₹{offer.minOrder}</span>}
              </div>
              <div className="of-actions">
                <button className={`of-toggle ${offer.isActive ? "on" : "off"}`}
                  onClick={() => toggleActive(offer)}>
                  {offer.isActive ? "✓ Active" : "Inactive"}
                </button>
                <button className="of-edit" onClick={() => openEdit(offer)}>Edit</button>
                <button className="of-del"  onClick={() => handleDelete(offer._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="of-overlay" onClick={closeForm}>
          <div className="of-modal" onClick={e => e.stopPropagation()}>
            <div className="of-modal-head">
              <h2>{editing ? "Edit Offer" : "Add New Offer"}</h2>
              <button className="of-close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="of-form">
              <div className="of-form-grid">
                <div className="of-field">
                  <label>Title *</label>
                  <input value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))}
                    placeholder="e.g. Flat 30% Off on Burgers" required />
                </div>
                <div className="of-field">
                  <label>Coupon Code *</label>
                  <input value={form.code} onChange={e => setForm(p=>({...p,code:e.target.value.toUpperCase()}))}
                    placeholder="e.g. BURGER30" required />
                </div>
                <div className="of-field of-full">
                  <label>Description</label>
                  <textarea value={form.description} rows={2}
                    onChange={e => setForm(p=>({...p,description:e.target.value}))}
                    placeholder="Short description for the offer" />
                </div>
                <div className="of-field">
                  <label>Discount Type</label>
                  <select value={form.discountType} onChange={e => setForm(p=>({...p,discountType:e.target.value}))}>
                    <option value="percent">Percentage</option>
                    <option value="flat">Flat Amount</option>
                    <option value="free_delivery">Free Delivery</option>
                  </select>
                </div>
                <div className="of-field">
                  <label>Discount Value {form.discountType === "percent" ? "(%)" : "(₹)"}</label>
                  <input type="number" min="0" value={form.discountValue}
                    onChange={e => setForm(p=>({...p,discountValue:+e.target.value}))}
                    disabled={form.discountType === "free_delivery"} />
                </div>
                <div className="of-field">
                  <label>Min Order (₹)</label>
                  <input type="number" min="0" value={form.minOrder}
                    onChange={e => setForm(p=>({...p,minOrder:+e.target.value}))} />
                </div>
                <div className="of-field">
                  <label>Badge Text</label>
                  <input value={form.badge} onChange={e => setForm(p=>({...p,badge:e.target.value}))}
                    placeholder="e.g. 30%\nOFF" />
                </div>
                <div className="of-field">
                  <label>Badge Label</label>
                  <input value={form.badgeLabel} onChange={e => setForm(p=>({...p,badgeLabel:e.target.value}))}
                    placeholder="e.g. FLASH SALE" />
                </div>
                <div className="of-field">
                  <label>Valid Till</label>
                  <input value={form.validTill} onChange={e => setForm(p=>({...p,validTill:e.target.value}))}
                    placeholder="e.g. Today only, Always valid" />
                </div>
                <div className="of-field">
                  <label>Card Color</label>
                  <input type="color" value={form.bgColor}
                    onChange={e => setForm(p=>({...p,bgColor:e.target.value}))} />
                </div>
                <div className="of-field">
                  <label>Sort Order</label>
                  <input type="number" min="0" value={form.sortOrder}
                    onChange={e => setForm(p=>({...p,sortOrder:+e.target.value}))} />
                </div>
                <div className="of-field">
                  <label>Status</label>
                  <select value={form.isActive} onChange={e => setForm(p=>({...p,isActive:e.target.value === "true"}))}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="of-form-footer">
                <button type="button" className="of-cancel" onClick={closeForm}>Cancel</button>
                <button type="submit" className="of-save" disabled={saving}>
                  {saving ? "Saving..." : editing ? "💾 Update" : "✅ Create Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
