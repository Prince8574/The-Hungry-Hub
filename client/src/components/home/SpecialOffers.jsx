import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/specialoffers.css";

gsap.registerPlugin(ScrollTrigger);

const OFFERS = [
  {
    id: 1,
    badge: "🔥 HOT DEAL",
    title: "First Order Free Delivery",
    desc: "Use code HUNGRY1 and get free delivery on your very first order. No minimum order value!",
    discount: "FREE",
    discountLabel: "Delivery",
    code: "HUNGRY1",
    bg: "offer-bg-orange",
    expires: "Limited time",
  },
  {
    id: 2,
    badge: "⚡ FLASH SALE",
    title: "Flat 30% Off on Burgers",
    desc: "Craving a juicy burger? Get 30% off on all burger combos today only. Valid till midnight!",
    discount: "30%",
    discountLabel: "Off",
    code: "BURGER30",
    bg: "offer-bg-red",
    expires: "Today only",
  },
  {
    id: 3,
    badge: "🎉 WEEKEND SPECIAL",
    title: "Buy 2 Get 1 Free Pizza",
    desc: "Order any 2 pizzas and get the third one absolutely free. Perfect for family weekends!",
    discount: "B2G1",
    discountLabel: "Free",
    code: "PIZZA3",
    bg: "offer-bg-purple",
    expires: "Weekends only",
  },
];

export default function SpecialOffers() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".offer-card",
      { opacity: 0, y: 40, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: sectionRef });

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    // Visual feedback handled by CSS :active
  };

  return (
    <section className="offers-section" ref={sectionRef}>
      <div className="section-header">
        <p className="section-tag">Limited Time</p>
        <h2 className="section-title">Special Offers & Deals</h2>
        <p className="section-sub">Grab these deals before they're gone!</p>
      </div>

      <div className="offers-grid">
        {OFFERS.map((offer) => (
          <div className={`offer-card ${offer.bg}`} key={offer.id}>
            {/* Decorative blob */}
            <div className="offer-blob" aria-hidden="true" />

            <div className="offer-top">
              <span className="offer-badge">{offer.badge}</span>
              <div className="offer-discount-pill">
                <span className="offer-discount-num">{offer.discount}</span>
                <span className="offer-discount-label">{offer.discountLabel}</span>
              </div>
            </div>

            <h3 className="offer-title">{offer.title}</h3>
            <p className="offer-desc">{offer.desc}</p>

            <div className="offer-footer">
              <div className="offer-code-wrap">
                <span className="offer-code-label">Use code:</span>
                <button
                  className="offer-code-btn"
                  onClick={() => handleCopy(offer.code)}
                  aria-label={`Copy code ${offer.code}`}
                >
                  {offer.code} <span className="offer-copy-icon">📋</span>
                </button>
              </div>
              <span className="offer-expires">⏰ {offer.expires}</span>
            </div>

            <Link to="/menu" className="offer-cta-btn">
              Grab Deal →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
