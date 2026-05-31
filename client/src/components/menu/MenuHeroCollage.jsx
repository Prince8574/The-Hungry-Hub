import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const COLLAGE = [
  {
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&auto=format",
    size: 200, top: "5%",  left: "30%", rotate: "-8deg", zIndex: 3, delay: 0,
  },
  {
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop&auto=format",
    size: 170, top: "8%",  left: "0%",  rotate: "6deg",  zIndex: 2, delay: 0.15,
  },
  {
    img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop&auto=format",
    size: 155, top: "42%", left: "48%", rotate: "10deg", zIndex: 2, delay: 0.3,
  },
  {
    img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop&auto=format",
    size: 175, top: "45%", left: "5%",  rotate: "-6deg", zIndex: 3, delay: 0.2,
  },
  {
    img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop&auto=format",
    size: 140, top: "2%",  left: "62%", rotate: "12deg", zIndex: 1, delay: 0.4,
  },
  {
    img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop&auto=format",
    size: 145, top: "60%", left: "30%", rotate: "-10deg",zIndex: 2, delay: 0.35,
  },
  {
    img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop&auto=format",
    size: 130, top: "65%", left: "62%", rotate: "7deg",  zIndex: 1, delay: 0.5,
  },
];

export default function MenuHeroCollage() {
  const ref = useRef(null);

  useGSAP(() => {
    const cards = ref.current.querySelectorAll(".mhc-card");

    // Entrance
    gsap.fromTo(cards,
      { opacity: 0, scale: 0.5, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "back.out(1.5)", delay: 0.5 }
    );

    // Float each card independently
    cards.forEach((card, i) => {
      const y   = 10 + (i % 3) * 6;
      const x   = 5  + (i % 2) * 4;
      const dur = 2.4 + i * 0.35;

      gsap.to(card, {
        y: `-=${y}`,
        x: i % 2 === 0 ? `+=${x}` : `-=${x}`,
        rotation: `+=${i % 2 === 0 ? 3 : -3}`,
        duration: dur,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.2,
      });
    });

    // Glow pulse
    gsap.to(".mhc-glow", {
      opacity: 0.7,
      scale: 1.15,
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.5,
    });

    // Rotating ring
    gsap.to(".mhc-ring", {
      rotation: 360,
      duration: 16,
      ease: "none",
      repeat: -1,
    });

  }, []);

  return (
    <div className="mhc-container" ref={ref}>
      {/* Decorative ring */}
      <div className="mhc-ring" />
      <div className="mhc-center-glow" />

      {COLLAGE.map((item, i) => (
        <div
          key={i}
          className="mhc-card"
          style={{
            width:   item.size,
            height:  item.size,
            top:     item.top,
            left:    item.left,
            zIndex:  item.zIndex,
            "--rot": item.rotate,
          }}
        >
          <div className="mhc-glow" />
          <img
            src={item.img}
            alt="food"
            className="mhc-img"
            draggable="false"
          />
          {/* Shine overlay */}
          <div className="mhc-shine" />
        </div>
      ))}

      {/* Floating labels */}
      <div className="mhc-label mhc-label-1">🔥 Trending</div>
      <div className="mhc-label mhc-label-2">⭐ 4.9 Rated</div>
      <div className="mhc-label mhc-label-3">🚀 30 min</div>
    </div>
  );
}
