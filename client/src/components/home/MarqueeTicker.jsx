import "../../styles/marquee.css";

const ROW1 = [
  "🍔 Smash Burger",
  "🍕 Margherita Pizza",
  "🌶️ Spicy Ramen",
  "🍰 Lava Cake",
  "🥗 Caesar Salad",
  "🍜 Carbonara",
  "🍗 Butter Chicken",
  "🥤 Mango Lassi",
];

const ROW2 = [
  "⚡ 30 Min Delivery",
  "⭐ 4.9 Rating",
  "🔥 500+ Dishes",
  "🌿 Fresh Daily",
  "💳 Secure Payment",
  "🚀 Fast & Hot",
  "👨‍🍳 Expert Chefs",
  "🎉 50K+ Happy Customers",
];

// Duplicate for seamless loop
const row1Items = [...ROW1, ...ROW1];
const row2Items = [...ROW2, ...ROW2];

export default function MarqueeTicker() {
  return (
    <div className="marquee-section">
      {/* Row 1 — scrolls left */}
      <div className="marquee-row marquee-row--left">
        {row1Items.map((item, i) => (
          <span className="marquee-item" key={i}>
            {item}
          </span>
        ))}
      </div>

      {/* Row 2 — scrolls right */}
      <div className="marquee-row marquee-row--right">
        {row2Items.map((item, i) => (
          <span className="marquee-item" key={i}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
