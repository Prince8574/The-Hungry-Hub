import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "../../styles/herofood.css";

const COLLAGE = [
  {
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&auto=format",
    size: 200, top: "5%",  left: "28%", rotate: "-8deg",  zIndex: 3, shape: "circle",
  },
  {
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop&auto=format",
    size: 170, top: "8%",  left: "0%",  rotate: "6deg",   zIndex: 2, shape: "heart",
  },
  {
    img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop&auto=format",
    size: 155, top: "42%", left: "48%", rotate: "10deg",  zIndex: 2, shape: "square",
  },
  {
    img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop&auto=format",
    size: 175, top: "45%", left: "4%",  rotate: "-6deg",  zIndex: 3, shape: "squircle",
  },
  {
    img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop&auto=format",
    size: 140, top: "2%",  left: "62%", rotate: "12deg",  zIndex: 1, shape: "circle",
  },
  {
    img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop&auto=format",
    size: 145, top: "60%", left: "28%", rotate: "-10deg", zIndex: 2, shape: "heart",
  },
  {
    img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop&auto=format",
    size: 130, top: "65%", left: "62%", rotate: "7deg",   zIndex: 1, shape: "square",
  },
];

const HEART_ID = "hf-heart-clip";

function HeartClipDef() {
  return (
    <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
      <defs>
        <clipPath id={HEART_ID} clipPathUnits="objectBoundingBox">
          <path d="M0.5,0.9 C0.5,0.9 0.05,0.55 0.05,0.3 C0.05,0.13 0.18,0.05 0.3,0.05 C0.38,0.05 0.46,0.1 0.5,0.18 C0.54,0.1 0.62,0.05 0.7,0.05 C0.82,0.05 0.95,0.13 0.95,0.3 C0.95,0.55 0.5,0.9 0.5,0.9 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

function getShapeStyle(shape) {
  switch (shape) {
    case "circle":   return { borderRadius: "50%", overflow: "hidden" };
    case "heart":    return { clipPath: `url(#${HEART_ID})`, borderRadius: "0", overflow: "visible" };
    case "square":   return { borderRadius: "22px", overflow: "hidden" };
    case "squircle": return { borderRadius: "38% 62% 55% 45% / 45% 38% 62% 55%", overflow: "hidden" };
    default:         return { borderRadius: "50%", overflow: "hidden" };
  }
}

export default function HeroFoodCards() {
  const ref = useRef(null);

  useGSAP(() => {
    const cards = ref.current.querySelectorAll(".hf-card");

    gsap.fromTo(cards,
      { opacity: 0, scale: 0.5, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "back.out(1.5)", delay: 0.5 }
    );

    cards.forEach((card, i) => {
      gsap.to(card, {
        y: `-=${10 + (i % 3) * 6}`,
        x: i % 2 === 0 ? `+=${5 + (i % 2) * 4}` : `-=${5 + (i % 2) * 4}`,
        rotation: `+=${i % 2 === 0 ? 3 : -3}`,
        duration: 2.4 + i * 0.35,
        ease: "sine.inOut",
        yoyo: true, repeat: -1,
        delay: i * 0.2,
      });
    });

    gsap.to(".hf-glow", {
      opacity: 0.7, scale: 1.15,
      duration: 2, ease: "sine.inOut",
      yoyo: true, repeat: -1, stagger: 0.5,
    });

    gsap.to(".hf-ring",   { rotation: 360,  duration: 16, ease: "none", repeat: -1 });
    gsap.to(".hf-ring-2", { rotation: -360, duration: 22, ease: "none", repeat: -1 });

  }, []);

  return (
    <div className="hf-container" ref={ref}>
      <HeartClipDef />

      <div className="hf-ring" />
      <div className="hf-ring-2" />
      <div className="hf-center-glow" />

      {COLLAGE.map((item, i) => (
        <div
          key={i}
          className="hf-card"
          style={{
            width:  item.size,
            height: item.size,
            top:    item.top,
            left:   item.left,
            zIndex: item.zIndex,
            "--rot": item.rotate,
            ...getShapeStyle(item.shape),
          }}
        >
          <div className="hf-glow" />
          <img src={item.img} alt="food" className="hf-img" draggable="false" />
          <div className="hf-shine" />
        </div>
      ))}

      <div className="hf-label hf-label-1">🔥 Trending</div>
      <div className="hf-label hf-label-2">⭐ 4.9 Rated</div>
      <div className="hf-label hf-label-3">🚀 30 min</div>
    </div>
  );
}
