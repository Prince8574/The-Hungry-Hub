import { createContext, useContext, useState, useEffect, useCallback } from "react";

const WishlistContext = createContext(null);
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  // ── Fetch wishlist from backend ──────────────────────────
  const fetchWishlist = useCallback(async () => {
    const token = getToken();
    if (!token) { setWishlistItems([]); return; }
    try {
      setLoading(true);
      const res = await fetch(`${API}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { setWishlistItems([]); return; }
      const data = await res.json();
      const items = (data.wishlist?.items || []).map(i => ({
        ...i.menuItem,
        _id:      i.menuItem._id,
        id:       i.menuItem._id,
        wishlistItemId: i._id,
        addedAt:  i.addedAt,
      }));
      setWishlistItems(items);
    } catch {
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount & when token changes
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // ── Add to wishlist ──────────────────────────────────────
  const addToWishlist = async (item) => {
    const token = getToken();
    if (!token) return;
    const menuItemId = item._id || item.id;
    try {
      const res = await fetch(`${API}/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ menuItemId }),
      });
      if (!res.ok) return;
      await fetchWishlist();
    } catch { /* silent */ }
  };

  // ── Remove from wishlist ─────────────────────────────────
  const removeFromWishlist = async (id) => {
    const token = getToken();
    if (!token) return;
    const menuItemId = id;
    try {
      const res = await fetch(`${API}/wishlist/${menuItemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      setWishlistItems(prev => prev.filter(i => (i._id || i.id) !== id));
    } catch { /* silent */ }
  };

  // ── Toggle wishlist ──────────────────────────────────────
  const toggleWishlist = async (item) => {
    const id = item._id || item.id;
    if (isInWishlist(id)) {
      await removeFromWishlist(id);
    } else {
      await addToWishlist(item);
    }
  };

  // ── Check if in wishlist ─────────────────────────────────
  const isInWishlist = (id) => {
    return wishlistItems.some(i => (i._id || i.id)?.toString() === id?.toString());
  };

  const clearWishlist = () => setWishlistItems([]);
  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount,
      loading,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      fetchWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
