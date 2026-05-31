import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import "../styles/wishlist.css";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  useGSAP(() => {
    gsap.fromTo(".wishlist-hero-content > *",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out", delay: 0.3 }
    );
    gsap.fromTo(".wl-card",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.4)", delay: 0.5 }
    );
  }, [wishlistItems]);

  const handleRemoveFromWishlist = (id) => {
    gsap.to(`#wl-${id}`, {
      opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        removeFromWishlist(id);
        toast.success("Removed from wishlist");
      }
    });
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart 🛒`);
    gsap.fromTo(`#wl-${item.id}`,
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
          <h1 className="wishlist-title">Your <span className="text-orange">Favourites</span></h1>
          <p className="wishlist-sub">{wishlistItems.length} saved item{wishlistItems.length !== 1 ? "s" : ""} — ready to order anytime</p>
        </div>
      </section>

      {/* Wishlist Body */}
      <section className="wishlist-body">
        {wishlistItems.length === 0 ? (
          <div className="wishlist-empty">
            <span>❤️</span>
            <h3>Your wishlist is empty</h3>
            <p>Save your favourite dishes here</p>
            <Link to="/menu" className="btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <>
            <div className="wl-grid">
              {wishlistItems.map((item) => (
                <div className="wl-card" key={item.id} id={`wl-${item.id}`}>
                  {/* Image */}
                  <div className="wl-img-wrap">
                    <img src={item.img} alt={item.name} className="wl-img" loading="lazy" />
                    <div className="wl-img-overlay" />
                    {item.tag && <span className="wl-tag">{item.tag}</span>}
                    {/* Remove heart */}
                    <button
                      className="wl-heart-btn"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      aria-label="Remove from wishlist"
                    >
                      ❤️
                    </button>
                  </div>
                  {/* Info */}
                  <div className="wl-body">
                    <span className="wl-category">{item.category}</span>
                    <h3 className="wl-name">{item.name}</h3>
                    <div className="wl-footer">
                      <div className="wl-price-wrap">
                        <span className="wl-price">₹{item.price}</span>
                        <span className="wl-rating">⭐ {item.rating}</span>
                      </div>
                      <button className="wl-add-btn" onClick={() => handleAddToCart(item)}>
                        + Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
