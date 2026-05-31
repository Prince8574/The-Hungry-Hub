import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "../../styles/foodcarousel.css";

const ITEMS = [
  { img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop&auto=format", name: "Classic Smash Burger",   price: "₹299", tag: "Bestseller", rating: "4.9", cat: "Burgers"  },
  { img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=400&fit=crop&auto=format", name: "Margherita Pizza",       price: "₹349", tag: "Popular",    rating: "4.8", cat: "Pizza"    },
  { img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=400&fit=crop&auto=format", name: "Butter Chicken",         price: "₹299", tag: "Indian",     rating: "4.9", cat: "Indian"   },
  { img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop&auto=format", name: "Spicy Ramen Bowl",       price: "₹249", tag: "Hot 🌶️",    rating: "4.7", cat: "Asian"    },
  { img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=400&fit=crop&auto=format", name: "Chocolate Lava Cake",    price: "₹149", tag: "Must Try",   rating: "4.9", cat: "Desserts" },
  { img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=400&fit=crop&auto=format", name: "Spaghetti Carbonara",    price: "₹299", tag: "Classic",    rating: "4.9", cat: "Pasta"    },
  { img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500&h=400&fit=crop&auto=format", name: "Mango Lassi",            price: "₹99",  tag: "Fresh",      rating: "4.9", cat: "Drinks"   },
];

export default function FoodCarousel() {
  const [active,   setActive]   = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX  = useRef(0);
  const trackRef = useRef(null);
  const autoRef  = useRef(null);

  const total = ITEMS.length;

  const goTo = useCallback((idx) => {
    const next = (idx + total) % total;
    gsap.to(".fc-slide.active", { opacity: 0, x: -30, scale: 0.96, duration: 0.3, ease: "power2.in" });
    setActive(next);
  }, [total]);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Auto-advance
  useEffect(() => {
    autoRef.current = setInterval(next, 3500);
    return () => clearInterval(autoRef.current);
  }, [next]);

  // Animate in new slide
  useEffect(() => {
    gsap.fromTo(".fc-slide.active",
      { opacity: 0, x: 40, scale: 0.96 },
      { opacity: 1, x: 0,  scale: 1, duration: 0.45, ease: "power3.out" }
    );
  }, [active]);

  // Touch / drag
  const onMouseDown = (e) => { setDragging(true); startX.current = e.clientX; clearInterval(autoRef.current); };
  const onMouseUp   = (e) => {
    if (!dragging) return;
    setDragging(false);
    const diff = e.clientX - startX.current;
    if (diff < -40) next();
    else if (diff > 40) prev();
  };
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; clearInterval(autoRef.current); };
  const onTouchEnd   = (e) => {
    const diff = e.changedTouches[0].clientX - startX.current;
    if (diff < -40) next();
    else if (diff > 40) prev();
  };

  const item = ITEMS[active];

  return (
    <section className="fc-section">
      {/* Section header */}
      <div className="fc-header">
        <div>
          <p className="fc-tag">Most Loved</p>
          <h2 className="fc-title">Popular <span className="fc-orange">Right Now</span></h2>
        </div>
        <Link to="/menu" className="fc-view-all">View All →</Link>
      </div>

      <div className="fc-body">
        {/* ── Main slide ── */}
        <div
          className="fc-main"
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={() => setDragging(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{ cursor: dragging ? "grabbing" : "grab" }}
        >
          <div className={`fc-slide active`} key={active}>
            <div className="fc-img-wrap">
              <img src={item.img} alt={item.name} className="fc-img" draggable="false" />
              <div className="fc-img-overlay" />
              <span className="fc-item-tag">{item.tag}</span>
              <span className="fc-item-cat">{item.cat}</span>
            </div>
            <div className="fc-info">
              <h3 className="fc-item-name">{item.name}</h3>
              <div className="fc-item-meta">
                <span className="fc-item-price">{item.price}</span>
                <span className="fc-item-rating">⭐ {item.rating}</span>
              </div>
              <Link to="/menu" className="fc-order-btn">Order Now →</Link>
            </div>
          </div>

          {/* Prev / Next arrows */}
          <button className="fc-arrow fc-prev" onClick={prev} aria-label="Previous">‹</button>
          <button className="fc-arrow fc-next" onClick={next} aria-label="Next">›</button>
        </div>

        {/* ── Thumbnail strip ── */}
        <div className="fc-thumbs">
          {ITEMS.map((it, i) => (
            <button
              key={i}
              className={`fc-thumb ${i === active ? "active" : ""}`}
              onClick={() => { clearInterval(autoRef.current); goTo(i); }}
            >
              <img src={it.img} alt={it.name} className="fc-thumb-img" />
              <div className="fc-thumb-overlay" />
              {i === active && <div className="fc-thumb-active-bar" />}
            </button>
          ))}
        </div>

        {/* ── Dots ── */}
        <div className="fc-dots">
          {ITEMS.map((_, i) => (
            <button
              key={i}
              className={`fc-dot ${i === active ? "active" : ""}`}
              onClick={() => { clearInterval(autoRef.current); goTo(i); }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
