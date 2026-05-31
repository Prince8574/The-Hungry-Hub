import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/categories.css";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  { name: "Burgers",    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop&auto=format", color: "#ff4500" },
  { name: "Pizza",      img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop&auto=format", color: "#ff6b00" },
  { name: "Indian",     img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&fit=crop&auto=format", color: "#ff6b00" },
  { name: "Asian",      img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop&auto=format", color: "#e65c00" },
  { name: "Pasta",      img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop&auto=format", color: "#f59e0b" },
  { name: "Desserts",   img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop&auto=format", color: "#f59e0b" },
  { name: "Drinks",     img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop&auto=format", color: "#3b82f6" },
  { name: "Healthy",    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop&auto=format", color: "#22c55e" },
  { name: "Sandwiches", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200&h=200&fit=crop&auto=format", color: "#a3e635" },
  { name: "Breakfast",  img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=200&h=200&fit=crop&auto=format", color: "#f59e0b" },
];

export default function CategoriesSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  // GSAP entrance animation
  useGSAP(() => {
    gsap.fromTo(
      ".category-card",
      { opacity: 0, scale: 0.7, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      }
    );
  }, { scope: sectionRef });

  // Drag-to-scroll
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = "grabbing";
  };

  const onMouseLeave = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section className="categories-section" ref={sectionRef}>
      <div className="section-header">
        <p className="section-tag">Browse by Category</p>
        <h2 className="section-title">What Are You Craving?</h2>
      </div>

      <div className="categories-scroll-wrapper">
        <div
          className="categories-track"
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {CATEGORIES.map((cat) => (
            <Link
              to="/menu"
              className="category-card"
              key={cat.name}
              style={{ "--cat-color": cat.color }}
              draggable={false}
            >
              <div className="category-img-wrap">
                <img src={cat.img} alt={cat.name} loading="lazy" />
              </div>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
