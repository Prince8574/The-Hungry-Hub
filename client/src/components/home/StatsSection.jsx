import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/stats.css";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { num: 500,  suffix: "+",    label: "Menu Items",      icon: "🍽️" },
  { num: 50,   suffix: "K+",   label: "Happy Customers", icon: "😊" },
  { num: 30,   suffix: " min", label: "Avg Delivery",    icon: "⚡" },
  { num: 4.9,  suffix: "⭐",   label: "App Rating",      icon: "🏆" },
];

export default function StatsSection() {
  const sectionRef = useRef(null);
  // Keep refs to the displayed number spans
  const numRefs = useRef([]);

  useGSAP(() => {
    // Card entrance
    gsap.fromTo(
      ".stat-card",
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

    // Counter animations — one per stat
    STATS.forEach((stat, i) => {
      const el = numRefs.current[i];
      if (!el) return;

      const isDecimal = !Number.isInteger(stat.num);
      const obj = { val: 0 };

      gsap.to(obj, {
        val: stat.num,
        duration: 2,
        ease: "power2.out",
        onUpdate() {
          const v = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val);
          el.textContent = v + stat.suffix;
        },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section className="stats-section" ref={sectionRef}>
      <div className="section-header">
        <p className="section-tag">By The Numbers</p>
        <h2 className="section-title">Why Thousands Trust Us</h2>
      </div>

      <div className="stats-grid">
        {STATS.map((stat, i) => (
          <div className="stat-card" key={stat.label}>
            <span className="stat-icon">{stat.icon}</span>
            <span
              className="stat-number"
              ref={(el) => (numRefs.current[i] = el)}
            >
              0{stat.suffix}
            </span>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
