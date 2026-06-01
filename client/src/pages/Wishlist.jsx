import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import "../styles/wishlist.css";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&auto=format";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  useGSAP(() => {
    gsap.fromTo(".wishlist-hero-content > *",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out", delay: 0.3 }
    );
    if (wishlistItems.length > 0) {
      gsap.fromTo(".wl-card",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.4)", delay: 0.5 }
      );
    }
  }, [wishlistItems]);

  const handleRemove = (item) => {
    const id = item._id || item.id;
    gsap.to(`#wl-${id}`, {
      opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        removeFromWishlist(id);
        toast.success("Removed from wishlist");
      }
    });
  };

  const handleAddToCart = (item) => {
    addToCart({
      _id:      item._id || item.id,
      id:       item._id || item.id,
      name:     item.name,
      price:    item.price,
      image:    item.image,
      category: item.category,
    });
    toast.success(`${item.name} added to cart 🛒`);
    const id = item._id || item.id;
    gsap.fromTo(`#wl-${id}`,
      { scale: 1 },
      { scale: 1.04, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" }
    );
  };

  return (
    <div className="wishlist-page">
      <Navbar />

      {/* Hero */}
      <section className="wishlist-hero">
        <div className="wishlist-hero-bg" />
        <div className="wishlist-hero-content">
          <p className="section-tag">My Wishlist</p>
          <h1 className="wishlist-title">
            Your <span className="text-orange">Favourites</span>
          </h1>
          <p className="wishlist-sub">
            {loading
              ? "Loading..."
              : `${wishlistItems.length} saved item${wishlistItems.length !== 1 ? "s" : ""} — ready to order anytime`}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="wishlist-body">
        {loading ? (
          <div className="wishlist-empty">
            <span>⏳</span>
            <h3>Loading your wishlist...</h3>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="wishlist-empty">
            <span>❤️</span>
            <h3>Your wishlist is empty</h3>
            <p>Save your favourite dishes here</p>
            <Link to="/menu" className="btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <div className="wl-grid">
            {wishlistItems.map((item) => {
              const id = item._id || item.id;
              const discountedPrice = item.discount > 0
                ? Math.round(item.price * (1 - item.discount / 100))
                : item.price;

              return (
                <div className="wl-card" key={id} id={`wl-${id}`}>
                  {/* Image */}
                  <div className="wl-img-wrap">
                    <img
                      src={item.image || FALLBACK_IMG}
                      alt={item.name}
                      className="wl-img"
                      loading="lazy"
                      onError={e => { e.target.src = FALLBACK_IMG; }}
                    />
                    <div className="wl-img-overlay" />
                    {item.tag && <span className="wl-tag">{item.tag}</span>}
                    {item.discount > 0 && (
                      <span className="wl-discount-badge">{item.discount}% OFF</span>
                    )}
                    {/* Veg/Non-veg indicator */}
                    <span className={`wl-veg-dot ${item.isVeg ? "veg" : "nonveg"}`} />
                    {/* Remove button */}
                    <button
                      className="wl-heart-btn"
                      onClick={() => handleRemove(item)}
                      aria-label="Remove from wishlist"
                    >
                      ❤️
                    </button>
                  </div>

                  {/* Info */}
                  <div className="wl-body">
                    <span className="wl-category">{item.category}</span>
                    <h3 className="wl-name">{item.name}</h3>
                    {item.description && (
                      <p className="wl-desc">{item.description}</p>
                    )}
                    <div className="wl-footer">
                      <div className="wl-price-wrap">
                        {item.discount > 0 && (
                          <span className="wl-price-original">₹{item.price}</span>
                        )}
                        <span className="wl-price">₹{discountedPrice}</span>
                        {item.rating > 0 && (
                          <span className="wl-rating">⭐ {item.rating}</span>
                        )}
                      </div>
                      <button
                        className="wl-add-btn"
                        onClick={() => handleAddToCart(item)}
                        disabled={item.inStock === false}
                      >
                        {item.inStock === false ? "Out of Stock" : "+ Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
