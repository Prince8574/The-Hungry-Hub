import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import "../styles/about.css";

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
  { emoji: "👨‍🍳", name: "Arjun Sharma", role: "Head Chef", desc: "15 years of culinary excellence across 5 countries" },
  { emoji: "👩‍💼", name: "Priya Mehta", role: "CEO & Founder", desc: "Passionate about bringing great food to every doorstep" },
  { emoji: "👨‍💻", name: "Rahul Verma", role: "Tech Lead", desc: "Building the fastest food delivery platform in India" },
  { emoji: "👩‍🍳", name: "Sneha Patel", role: "Pastry Chef", desc: "Award-winning dessert specialist with a sweet vision" },
];

const MILESTONES = [
  { year: "2020", title: "Founded", desc: "Started with a small kitchen and big dreams in Bangalore" },
  { year: "2021", title: "10K Orders", desc: "Reached our first 10,000 happy customers milestone" },
  { year: "2022", title: "5 Cities", desc: "Expanded to Mumbai, Delhi, Pune, Hyderabad & Chennai" },
  { year: "2023", title: "50K Users", desc: "50,000 registered users and 500+ menu items" },
  { year: "2024", title: "App Launch", desc: "Launched our mobile app with 4.9 star rating" },
  { year: "2026", title: "Going Global", desc: "Expanding internationally — the world deserves great food" },
];

const VALUES = [
  { icon: "🌿", title: "Fresh Ingredients", desc: "We source locally and seasonally for maximum freshness" },
  { icon: "❤️", title: "Made with Love", desc: "Every dish is crafted with passion and attention to detail" },
  { icon: "⚡", title: "Speed & Reliability", desc: "30-minute delivery promise, every single time" },
  { icon: "🌍", title: "Sustainability", desc: "Eco-friendly packaging and zero food waste policy" },
  { icon: "🤝", title: "Community First", desc: "Supporting local farmers and restaurant partners" },
  { icon: "🔒", title: "Safe & Hygienic", desc: "FSSAI certified kitchens with strict hygiene standards" },
];

export default function About() {
  useGSAP(() => {
    gsap.fromTo(".about-hero-content > *", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out", delay: 0.3 });
    gsap.fromTo(".value-card", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".values-grid", start: "top 80%" } });
    gsap.fromTo(".milestone-item", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".milestones", start: "top 80%" } });
    gsap.fromTo(".team-card", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.4)", scrollTrigger: { trigger: ".team-grid", start: "top 80%" } });
  }, []);

  return (
    <div className="about-page">
      <Navbar />

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="about-hero-content">
          <p className="section-tag">Our Story</p>
          <h1 className="about-title">
            Food is More Than <br />
            <span className="text-orange">Just a Meal</span>
          </h1>
          <p className="about-subtitle">
            We started The Hungry Hub with one simple belief — everyone deserves
            access to delicious, fresh, and affordable food delivered with care.
          </p>
          <div className="about-hero-stats">
            <div className="astat"><span className="astat-num">6+</span><span className="astat-label">Years</span></div>
            <div className="astat-div" />
            <div className="astat"><span className="astat-num">50K+</span><span className="astat-label">Customers</span></div>
            <div className="astat-div" />
            <div className="astat"><span className="astat-num">500+</span><span className="astat-label">Dishes</span></div>
            <div className="astat-div" />
            <div className="astat"><span className="astat-num">10+</span><span className="astat-label">Cities</span></div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="section-header">
          <p className="section-tag">What We Stand For</p>
          <h2 className="section-title">Our Core Values</h2>
          <p className="section-sub">The principles that guide every dish we make and every delivery we send</p>
        </div>
        <div className="values-grid">
          {VALUES.map((v, i) => (
            <div className="value-card" key={i}>
              <div className="value-icon">{v.icon}</div>
              <h3 className="value-title">{v.title}</h3>
              <p className="value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline-section">
        <div className="section-header">
          <p className="section-tag">Our Journey</p>
          <h2 className="section-title">How We Got Here</h2>
        </div>
        <div className="milestones">
          {MILESTONES.map((m, i) => (
            <div className={`milestone-item ${i % 2 === 0 ? "left" : "right"}`} key={i}>
              <div className="milestone-year">{m.year}</div>
              <div className="milestone-dot" />
              <div className="milestone-card">
                <h3 className="milestone-title">{m.title}</h3>
                <p className="milestone-desc">{m.desc}</p>
              </div>
            </div>
          ))}
          <div className="timeline-line" />
        </div>
      </section>

      {/* Team */}
      <section className="team-section">
        <div className="section-header">
          <p className="section-tag">The People</p>
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-sub">Passionate individuals working together to feed the world</p>
        </div>
        <div className="team-grid">
          {TEAM.map((member, i) => (
            <div className="team-card" key={i}>
              <div className="team-avatar">{member.emoji}</div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-desc">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta-blob" />
        <h2 className="cta-title">Join Our Food Family 🍔</h2>
        <p className="cta-sub">Be part of 50,000+ food lovers who trust The Hungry Hub every day</p>
        <div className="about-cta-btns">
          <Link to="/menu" className="btn-primary">Explore Menu</Link>
          <Link to="/register" className="btn-secondary">Sign Up Free</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo"><span>🍔</span><span className="footer-logo-text">The Hungry Hub</span></div>
        <p className="footer-copy">© 2026 The Hungry Hub. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/menu">Menu</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
