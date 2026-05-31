import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "../../context/CartContext";
import "../../styles/populardishes.css";

gsap.registerPlugin(ScrollTrigger);

const DISHES = [
  {
    id: "d1",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format",
    name: "Classic Smash Burger",
    category: "Burgers",
    price: 249,
    rating: 4.9,
    reviews: 1240,
    tag: "Best Seller",
    time: "25 min",
  },
  {
    id: "d2",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&auto=format",
    name: "Margherita Pizza",
    category: "Pizza",
    price: 299,
    rating: 4.8,
    reviews: 980,
    tag: "Popular",
    time: "30 min",
  },
  {
    id: "d3",
    img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&auto=format",
    name: "Spicy Ramen Bowl",
    category: "Asian",
    price: 199,
    rating: 4.7,
    reviews: 760,
    tag: "Trending",
    time: "20 min",
  },
  {
    id: "d4",
    img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop&auto=format",
    name: "Butter Chicken",
    category: "Indian",
    price: 279,
    rating: 4.9,
    reviews: 1560,
    tag: "Best Seller",
    time: "35 min",
  },
  {
    id: "d5",
    img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop&auto=format",
    name: "Loaded Tacos",
    category: "Mexican",
    price: 179,
    rating: 4.6,
    reviews: 540,
    tag: "New",
    time: "20 min",
  },
  {
    id: "d6",
    img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop&auto=format",
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 149,
    rating: 4.9,
    reviews: 890,
    tag: "Fan Fav",
    time: "15 min",
  },
  {
    id: "d7",
    img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop&auto=format",
    name: "Creamy Pasta",
    category: "Pasta",
    price: 229,
    rating: 4.7,
    reviews: 620,
    tag: "Popular",
    time: "25 min",
  },
  {
    id: "d8",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&auto=format",
    name: "Healthy Buddha Bowl",
    category: "Healthy",
    price: 219,
    rating: 4.8,
    reviews: 430,
    tag: "New",
    time: "15 min",
  },
];

const FILTERS = ["All", "Burgers", "Pizza", "Indian", "Asian", "Desserts", "Pasta", "Healthy", "Mexican"];

function AddButton({ dish }) {
  const { addToCart, cartItems } = useCart();
  const inCart = cartItems.some((i) => i.id === dish.id);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({ id: dish.id, name: dish.name, price: dish.price, image: dish.img });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      className={`pop-add-btn${inCart ? " in-cart" : ""}`}
      onClick={handleAdd}
      aria-label={`Add ${dish.name} to cart`}
    >
      {added ? "✅ Added!" : inCart ? "✔ In Cart" : "+ Add to Cart"}
    </button>
  );
}

export default function PopularDishes() {
  const sectionRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? DISHES
      : DISHES.filter((d) => d.category === activeFilter);

  useGSAP(() => {
    gsap.fromTo(
      ".pop-dish-card",
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section className="popular-dishes-section" ref={sectionRef}>
      <div className="section-header">
        <p className="section-tag">Top Rated</p>
        <h2 className="section-title">Popular Dishes</h2>
        <p className="section-sub">Loved by thousands — order yours today</p>
      </div>

      {/* Filter tabs */}
      <div className="pop-filters" role="tablist" aria-label="Filter dishes by category">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`pop-filter-btn${activeFilter === f ? " active" : ""}`}
            onClick={() => setActiveFilter(f)}
            role="tab"
            aria-selected={activeFilter === f}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Dishes grid */}
      <div className="pop-dishes-grid">
        {filtered.map((dish) => (
          <div className="pop-dish-card" key={dish.id}>
            {/* Image */}
            <div className="pop-dish-img-wrap">
              <img src={dish.img} alt={dish.name} loading="lazy" className="pop-dish-img" />
              <span className="pop-dish-tag">{dish.tag}</span>
              <span className="pop-dish-time-badge">⏱ {dish.time}</span>
            </div>

            {/* Body */}
            <div className="pop-dish-body">
              <span className="pop-dish-category">{dish.category}</span>
              <h3 className="pop-dish-name">{dish.name}</h3>
              <div className="pop-dish-footer">
                <span className="pop-dish-price">₹{dish.price}</span>
                <div className="pop-dish-rating">
                  <span>★</span> {dish.rating} ({dish.reviews})
                </div>
              </div>
              <AddButton dish={dish} />
            </div>
          </div>
        ))}
      </div>

      <div className="view-all-wrap">
        <Link to="/menu" className="btn-secondary">
          View Full Menu →
        </Link>
      </div>
    </section>
  );
}
