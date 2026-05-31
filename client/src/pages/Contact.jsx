import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import "../styles/contact.css";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_INFO = [
  { icon: "📍", title: "Our Location", value: "123 Food Street, Koramangala\nBangalore, Karnataka 560034" },
  { icon: "📞", title: "Phone", value: "+91 98765 43210\n+91 80 1234 5678" },
  { icon: "✉️", title: "Email", value: "hello@hungryhub.com\nsupport@hungryhub.com" },
  { icon: "🕐", title: "Working Hours", value: "Mon – Sun: 9:00 AM – 11:00 PM\nDelivery: 10:00 AM – 10:30 PM" },
];

const FAQS = [
  { q: "How long does delivery take?", a: "We deliver within 30 minutes on average. During peak hours it may take up to 45 minutes." },
  { q: "What is the minimum order amount?", a: "Minimum order is ₹99. Free delivery on orders above ₹299." },
  { q: "Can I cancel my order?", a: "You can cancel within 5 minutes of placing the order. After that, the kitchen has already started preparing." },
  { q: "Do you offer vegetarian options?", a: "Yes! We have a wide range of vegetarian and vegan options clearly marked on our menu." },
  { q: "How do I track my order?", a: "Once your order is confirmed, you'll receive a live tracking link via SMS and email." },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useGSAP(() => {
    gsap.fromTo(".contact-hero-content > *", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out", delay: 0.3 });
    gsap.fromTo(".info-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".info-cards", start: "top 80%" } });
    gsap.fromTo(".contact-form-box", { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: ".contact-form-box", start: "top 80%" } });
    gsap.fromTo(".faq-item", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".faq-list", start: "top 80%" } });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Message sent! We'll reply within 24 hours 📧");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  const toggleFaq = (i) => {
    setOpenFaq(openFaq === i ? null : i);
    gsap.fromTo(`.faq-answer-${i}`, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" });
  };

  return (
    <div className="contact-page">
      <Navbar />

      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero-bg" />
        <div className="contact-hero-content">
          <p className="section-tag">Get In Touch</p>
          <h1 className="contact-title">
            We'd Love to <span className="text-orange">Hear From You</span>
          </h1>
          <p className="contact-subtitle">
            Have a question, feedback, or just want to say hi? Our team is here for you 24/7.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="contact-info-section">
        <div className="info-cards">
          {CONTACT_INFO.map((info, i) => (
            <div className="info-card" key={i}>
              <div className="info-icon">{info.icon}</div>
              <h3 className="info-title">{info.title}</h3>
              <p className="info-value">{info.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="contact-main">
        {/* Form */}
        <div className="contact-form-box">
          <h2 className="form-title">Send Us a Message</h2>
          <p className="form-sub">We typically reply within 24 hours</p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-wrap">
                  <span className="inp-icon">👤</span>
                  <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <div className="input-wrap">
                  <span className="inp-icon">✉️</span>
                  <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <div className="input-wrap">
                <span className="inp-icon">📝</span>
                <input type="text" name="subject" placeholder="How can we help?" value={form.subject} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                name="message"
                placeholder="Tell us everything..."
                value={form.message}
                onChange={handleChange}
                rows={5}
              />
            </div>

            <button type="submit" className="contact-submit-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : "Send Message 🚀"}
            </button>
          </form>
        </div>

        {/* Map placeholder */}
        <div className="map-box">
          <div className="map-placeholder">
            <span className="map-pin">📍</span>
            <h3>Find Us Here</h3>
            <p>123 Food Street, Koramangala<br />Bangalore, Karnataka 560034</p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="section-header">
          <p className="section-tag">FAQ</p>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-sub">Quick answers to the questions we hear most often</p>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, i) => (
            <div className={`faq-item ${openFaq === i ? "open" : ""}`} key={i}>
              <button className="faq-question" onClick={() => toggleFaq(i)}>
                <span>{faq.q}</span>
                <span className="faq-arrow">{openFaq === i ? "▲" : "▼"}</span>
              </button>
              {openFaq === i && (
                <div className={`faq-answer faq-answer-${i}`}>
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
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
