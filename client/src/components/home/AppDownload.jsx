import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/appdownload.css";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { icon: "🔔", text: "Real-time order tracking" },
  { icon: "💳", text: "Secure & fast payments" },
  { icon: "🎁", text: "Exclusive app-only deals" },
  { icon: "⭐", text: "Rate & review your orders" },
];

export default function AppDownload() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(".app-text-col", { opacity: 0, x: -50 }, {
      opacity: 1, x: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
    });
    gsap.fromTo(".app-mockup-col", { opacity: 0, x: 50 }, {
      opacity: 1, x: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
    });
    gsap.fromTo(".app-feature-item", { opacity: 0, x: -20 }, {
      opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: "power2.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
    });
    gsap.fromTo(".app-cta-strip", { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
      scrollTrigger: { trigger: ".app-cta-strip", start: "top 90%" },
    });
  }, { scope: sectionRef });

  return (
    <section className="app-download-section" ref={sectionRef}>
      <div className="app-blob app-blob-1" aria-hidden="true" />
      <div className="app-blob app-blob-2" aria-hidden="true" />

      {/* ── TOP: App info + Phone mockup ── */}
      <div className="app-inner">
        {/* Left */}
        <div className="app-text-col">
          <p className="section-tag">Mobile App</p>
          <h2 className="section-title app-title">
            Order Faster with <br />
            <span className="app-title-highlight">Our Mobile App</span>
          </h2>
          <p className="app-subtitle">
            Download The Hungry Hub app and enjoy a seamless food ordering
            experience. Track your order live, get exclusive deals, and reorder
            your favourites in one tap.
          </p>

          <ul className="app-features-list">
            {FEATURES.map((f) => (
              <li className="app-feature-item" key={f.text}>
                <span className="app-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          <div className="app-store-btns">
            <button className="store-btn" aria-label="Download on the App Store"
              onClick={() => alert("App Store link coming soon!")}>
              <span className="store-btn-icon">🍎</span>
              <div className="store-btn-text">
                <span className="store-btn-sub">Download on the</span>
                <span className="store-btn-main">App Store</span>
              </div>
            </button>
            <button className="store-btn" aria-label="Get it on Google Play"
              onClick={() => alert("Google Play link coming soon!")}>
              <span className="store-btn-icon">▶️</span>
              <div className="store-btn-text">
                <span className="store-btn-sub">Get it on</span>
                <span className="store-btn-main">Google Play</span>
              </div>
            </button>
          </div>

          <p className="app-rating-note">⭐ 4.9 rating &nbsp;·&nbsp; 50K+ downloads &nbsp;·&nbsp; Free to download</p>
        </div>

        {/* Right: Phone mockup */}
        <div className="app-mockup-col" aria-hidden="true">
          <div className="phone-mockup">
            <div className="phone-notch" />
            <div className="phone-screen">
              <div className="phone-screen-header">
                <span className="phone-app-name">🍔 Hungry Hub</span>
                <span className="phone-cart-icon">🛒</span>
              </div>
              <div className="phone-hero-img">🍕🍔🍜</div>
              <div className="phone-order-card">
                <div className="phone-order-row">
                  <span>Smash Burger</span><span className="phone-price">₹249</span>
                </div>
                <div className="phone-order-row">
                  <span>Margherita Pizza</span><span className="phone-price">₹299</span>
                </div>
                <div className="phone-order-divider" />
                <div className="phone-order-row phone-order-total">
                  <span>Total</span><span>₹548</span>
                </div>
              </div>
              <div className="phone-track-bar">
                <span className="phone-track-dot active" />
                <div className="phone-track-line" />
                <span className="phone-track-dot active" />
                <div className="phone-track-line" />
                <span className="phone-track-dot" />
              </div>
              <p className="phone-track-label">🚀 On the way — 12 min</p>
            </div>
          </div>
          <div className="phone-badge phone-badge-1">⚡ 30 min delivery</div>
          <div className="phone-badge phone-badge-2">🎁 App-only deals</div>
        </div>
      </div>

      {/* ── BOTTOM: CTA strip ── */}
      <div className="app-cta-strip">
        <div className="app-cta-blob" aria-hidden="true" />
        <div className="app-cta-content">
          <div className="app-cta-text">
            <h2 className="app-cta-title">Ready to Order? 🍔</h2>
            <p className="app-cta-sub">
              Join 50,000+ food lovers and get your first order with free delivery!
            </p>
          </div>
          <Link to="/register" className="btn-primary app-cta-btn">
            Order Now — It's Free
          </Link>
        </div>
      </div>
    </section>
  );
}
