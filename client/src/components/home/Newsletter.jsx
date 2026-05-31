import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/newsletter.css";

gsap.registerPlugin(ScrollTrigger);

const PERKS = [
  { icon: "🎁", text: "Exclusive deals & coupons" },
  { icon: "🍽️", text: "New dish announcements" },
  { icon: "⚡", text: "Flash sale alerts" },
  { icon: "🔔", text: "Early access to new items" },
];

export default function Newsletter() {
  const sectionRef = useRef(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  useGSAP(() => {
    gsap.fromTo(
      ".nl-left",
      { opacity: 0, x: -40 },
      {
        opacity: 1, x: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      }
    );
    gsap.fromTo(
      ".nl-right",
      { opacity: 0, x: 40 },
      {
        opacity: 1, x: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      }
    );
  }, { scope: sectionRef });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  return (
    <section className="newsletter-section" ref={sectionRef}>
      <div className="newsletter-blob" aria-hidden="true" />

      <div className="newsletter-row">
        {/* ── LEFT COL ── */}
        <div className="nl-left">
          <div className="newsletter-icon-wrap" aria-hidden="true">
            <span className="newsletter-main-icon">📧</span>
          </div>
          <p className="section-tag" style={{ textAlign: "left" }}>Stay in the Loop</p>
          <h2 className="section-title newsletter-title">
            Get Exclusive Deals <br /> in Your Inbox
          </h2>
          <p className="newsletter-sub">
            Subscribe and never miss a deal, new dish, or flash sale.
            No spam — only the good stuff!
          </p>

          <ul className="newsletter-perks-list">
            {PERKS.map((p) => (
              <li className="newsletter-perk" key={p.text}>
                <span className="newsletter-perk-icon">{p.icon}</span>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── RIGHT COL ── */}
        <div className="nl-right">
          <div className="nl-form-card">
            <h3 className="nl-form-title">Subscribe Now</h3>
            <p className="nl-form-sub">Join 50,000+ food lovers today</p>

            {status === "success" ? (
              <div className="newsletter-success" role="alert">
                <span className="newsletter-success-icon">🎉</span>
                <div>
                  <p className="newsletter-success-title">You're subscribed!</p>
                  <p className="newsletter-success-sub">Check your inbox for a welcome coupon 🎁</p>
                </div>
              </div>
            ) : (
              <form
                className="newsletter-form"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Newsletter subscription form"
              >
                <div className="newsletter-input-wrap">
                  <span className="newsletter-input-icon" aria-hidden="true">✉️</span>
                  <input
                    type="email"
                    className={`newsletter-input${status === "error" ? " input-error" : ""}`}
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    aria-label="Email address"
                    required
                  />
                </div>

                {status === "error" && (
                  <p className="newsletter-error" role="alert">
                    Please enter a valid email address.
                  </p>
                )}

                <button
                  type="submit"
                  className="newsletter-submit-btn btn-primary"
                  disabled={status === "loading"}
                  aria-busy={status === "loading"}
                >
                  {status === "loading" ? (
                    <span className="newsletter-spinner" aria-hidden="true" />
                  ) : (
                    "Subscribe & Get 10% Off 🎁"
                  )}
                </button>
              </form>
            )}

            <p className="newsletter-disclaimer">
              🔒 We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
