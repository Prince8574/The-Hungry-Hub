import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/howitworks.css";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    step: "01",
    icon: "🔍",
    title: "Browse Menu",
    desc: "Explore 500+ dishes across 10+ categories. Filter by cuisine, price, or rating.",
  },
  {
    step: "02",
    icon: "🛒",
    title: "Place Your Order",
    desc: "Add items to cart, choose your address, and pay securely in seconds.",
  },
  {
    step: "03",
    icon: "🚀",
    title: "Fast Delivery",
    desc: "Our delivery partners bring your hot, fresh food to your door in 30 minutes.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".hiw-card",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    gsap.fromTo(
      ".hiw-connector",
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section className="hiw-section" ref={sectionRef}>
      <div className="section-header">
        <p className="section-tag">Simple Process</p>
        <h2 className="section-title">How It Works</h2>
        <p className="section-sub">Order your favourite food in just 3 easy steps</p>
      </div>

      <div className="hiw-steps">
        {STEPS.map((s, i) => (
          <div className="hiw-step-wrap" key={s.step}>
            <div className="hiw-card">
              <div className="hiw-step-num">{s.step}</div>
              <div className="hiw-icon">{s.icon}</div>
              <h3 className="hiw-title">{s.title}</h3>
              <p className="hiw-desc">{s.desc}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div className="hiw-connector" aria-hidden="true">
                <div className="hiw-connector-line" />
                <span className="hiw-connector-arrow">→</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
