import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/testimonials.css";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    avatar: "PS",
    rating: 5,
    text: "Best food delivery app! The burgers are absolutely amazing and always arrive hot. 10/10 would recommend!",
    location: "Mumbai",
    order: "Classic Smash Burger",
  },
  {
    name: "Rahul Verma",
    avatar: "RV",
    rating: 5,
    text: "Ordered biryani at midnight and it arrived in 28 minutes. Freshest food I've ever had delivered!",
    location: "Delhi",
    order: "Chicken Biryani",
  },
  {
    name: "Ananya Singh",
    avatar: "AS",
    rating: 5,
    text: "The lava cake is to die for! Perfectly warm, perfectly gooey. I order it every single week.",
    location: "Bangalore",
    order: "Chocolate Lava Cake",
  },
  {
    name: "Karan Mehta",
    avatar: "KM",
    rating: 4,
    text: "Great variety of cuisines. The ramen is authentic and the portions are generous. Love this app!",
    location: "Pune",
    order: "Spicy Ramen Bowl",
  },
  {
    name: "Sneha Patel",
    avatar: "SP",
    rating: 5,
    text: "Seamless ordering experience. The pizza arrived piping hot with perfect crust. My go-to app now!",
    location: "Ahmedabad",
    order: "Margherita Pizza",
  },
  {
    name: "Arjun Nair",
    avatar: "AN",
    rating: 5,
    text: "Incredible food quality and super fast delivery. The butter chicken is restaurant-quality!",
    location: "Chennai",
    order: "Butter Chicken",
  },
];

function StarRating({ rating }) {
  return (
    <div className="testimonial-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "star-filled" : "star-empty"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  // Auto-rotate every 4 seconds
  const startAutoRotate = () => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
  };

  useEffect(() => {
    startAutoRotate();
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleDotClick = (i) => {
    setActiveIndex(i);
    // Reset timer on manual navigation
    clearInterval(intervalRef.current);
    startAutoRotate();
  };

  // GSAP entrance
  useGSAP(() => {
    gsap.fromTo(
      ".testimonial-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section className="testimonials-section" ref={sectionRef}>
      <div className="section-header">
        <p className="section-tag">Loved by 50,000+</p>
        <h2 className="section-title">What Our Customers Say</h2>
        <p className="section-sub">Real reviews from real food lovers</p>
      </div>

      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <div
            className={`testimonial-card${i === activeIndex ? " active" : ""}`}
            key={t.name}
          >
            {/* Top row: avatar + stars */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
              <div className="testimonial-avatar" aria-hidden="true">
                {t.avatar}
              </div>
              <StarRating rating={t.rating} />
            </div>

            {/* Quote */}
            <p className="testimonial-text">"{t.text}"</p>

            {/* Footer */}
            <div className="testimonial-footer">
              <div className="testimonial-avatar" aria-hidden="true" style={{ width: 36, height: 36, fontSize: "0.75rem" }}>
                {t.avatar}
              </div>
              <div className="testimonial-info">
                <p className="testimonial-name">{t.name}</p>
                <p className="testimonial-location">📍 {t.location}</p>
              </div>
              <span className="testimonial-order">🍽️ {t.order}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="testimonials-dots" role="tablist" aria-label="Testimonial navigation">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            className={`testimonials-dot${i === activeIndex ? " active" : ""}`}
            onClick={() => handleDotClick(i)}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
