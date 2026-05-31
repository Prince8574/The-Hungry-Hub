import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const FOOD_IMAGES = [
  { img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop&auto=format",  top: "8%",   left: "2%",   size: 130, rotate: "-12deg", delay: 0    },
  { img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop&auto=format",  top: "2%",   left: "20%",  size: 100, rotate: "8deg",   delay: 0.2  },
  { img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=300&fit=crop&auto=format",  top: "52%",  left: "0%",   size: 115, rotate: "10deg",  delay: 0.4  },
  { img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop&auto=format",  top: "68%",  left: "16%",  size: 95,  rotate: "-8deg",  delay: 0.6  },
  { img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=300&fit=crop&auto=format",     top: "10%",  right: "1%",  size: 125, rotate: "14deg",  delay: 0.15 },
  { img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=300&fit=crop&auto=format",  top: "5%",   right: "20%", size: 98,  rotate: "-6deg",  delay: 0.35 },
  { img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop&auto=format",  top: "58%",  right: "2%",  size: 110, rotate: "-10deg", delay: 0.55 },
  { img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=300&fit=crop&auto=format",     top: "70%",  right: "18%", size: 90,  rotate: "7deg",   delay: 0.75 },
  { img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=300&fit=crop&auto=format",  top: "35%",  left: "6%",   size: 85,  rotate: "12deg",  delay: 0.9  },
  { img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop&auto=format",  top: "38%",  right: "7%",  size: 88,  rotate: "-14deg", delay: 1.0  },
  { img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop&auto=format",  top: "82%",  left: "38%",  size: 80,  rotate: "5deg",   delay: 1.1  },
  { img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=300&fit=crop&auto=format",     top: "80%",  right: "38%", size: 78,  rotate: "-5deg",  delay: 1.2  },
];

export default function MenuHeroBg() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const items = containerRef.current.querySelectorAll(".mhb-item");

    // Entrance
    gsap.fromTo(items,
      { opacity: 0, scale: 0.3 },
      { opacity: 1, scale: 1, duration: 1, stagger: 0.08, ease: "back.out(1.6)", delay: 0.1 }
    );

    // Float animations
    items.forEach((el, i) => {
      const yAmt = 12 + (i % 4) * 5;
      const xAmt = 5 + (i % 3) * 3;
      const dur  = 2.8 + i * 0.3;

      gsap.to(el, {
        y: `-=${yAmt}`,
        x: i % 2 === 0 ? `+=${xAmt}` : `-=${xAmt}`,
        rotation: `+=${i % 2 === 0 ? 3 : -3}`,
        duration: dur,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 0.2,
      });
    });
  }, []);

  return (
    <div className="mhb-container" ref={containerRef}>
      {FOOD_IMAGES.map((item, i) => (
        <div
          key={i}
          className="mhb-item"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            width: item.size,
            height: item.size,
            "--init-rotate": item.rotate,
          }}
        >
          <img src={item.img} alt="food" className="mhb-img" draggable="false" />
          <div className="mhb-glow" />
        </div>
      ))}
    </div>
  );
}
