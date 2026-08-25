import { useState, useRef, useEffect, useCallback } from "react";
import "./HeroImageTrail.css";

// Curated full-stack engineering & UI cards with high quality visuals + fallback graphics
const TRAIL_ITEMS = [
  {
    id: 1,
    title: "Java & Spring Boot Core",
    tag: "REST API · Backend",
    accent: "#7c6cfa",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    caption: "Enterprise Architecture"
  },
  {
    id: 2,
    title: "MERN Stack Application",
    tag: "React · Node · Express",
    accent: "#38bdf8",
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    caption: "Full-Stack Dashboard"
  },
  {
    id: 3,
    title: "Hotel Rental Booking System",
    tag: "Project #014 · Java",
    accent: "#f59e0b",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    caption: "Room Engine & Console"
  },
  {
    id: 4,
    title: "Developer Activity Portal",
    tag: "US IT Consulting · Spring",
    accent: "#10b981",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    caption: "Real-time Metrics UI"
  },
  {
    id: 5,
    title: "500+ LeetCode DSA Mastery",
    tag: "Algorithms · Graph / DP",
    accent: "#ec4899",
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    caption: "Top 5% on GFG"
  },
  {
    id: 6,
    title: "Modern UI / UX Precision",
    tag: "Glassmorphism · Responsive",
    accent: "#8b5cf6",
    img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
    caption: "Interactive Frontend"
  },
  {
    id: 7,
    title: "Technical Mentorship",
    tag: "Kalvium · Live Labs",
    accent: "#06b6d4",
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
    caption: "Mentoring Next-Gen Devs"
  },
  {
    id: 8,
    title: "Clean Code & Cloud Pipeline",
    tag: "Maven · Git · Docker",
    accent: "#a855f7",
    img: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80",
    caption: "Production Deployments"
  }
];

const THRESHOLD = 50; // Pixels moved before next picture spawns
const MAX_TRAIL_ITEMS = 6; // Max visible simultaneous items
const LIFETIME_MS = 1500; // Duration before fading out

export default function HeroImageTrail({ containerRef }) {
  const [items, setItems] = useState([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const itemIndex = useRef(0);
  const zCounter = useRef(10);

  const spawnImage = useCallback((x, y) => {
    const nextItemData = TRAIL_ITEMS[itemIndex.current % TRAIL_ITEMS.length];
    itemIndex.current += 1;
    zCounter.current += 1;

    // Slight random rotation and subtle scale
    const randomRotation = (Math.random() * 20 - 10).toFixed(1); // between -10 and +10 deg
    const randomScale = (0.96 + Math.random() * 0.12).toFixed(2);
    const uniqueId = `${Date.now()}-${Math.random()}`;

    const newItem = {
      id: uniqueId,
      x,
      y,
      rotation: randomRotation,
      scale: randomScale,
      zIndex: zCounter.current,
      data: nextItemData
    };

    setItems((prev) => {
      const updated = [...prev.slice(-(MAX_TRAIL_ITEMS - 1)), newItem];
      return updated;
    });

    // Auto remove after lifetime
    setTimeout(() => {
      setItems((prev) => prev.filter((it) => it.id !== uniqueId));
    }, LIFETIME_MS);
  }, []);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      // Prevent spawning trail images when hovering over interactive CTA buttons, 3D card, or links
      if (e.target.closest && e.target.closest(".hero-cta-group, .cv-3d-card-wrapper, .hero-cta-btn, .hero-badge-interactive, a, button")) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dist = Math.hypot(x - lastPos.current.x, y - lastPos.current.y);

      if (dist > THRESHOLD) {
        lastPos.current = { x, y };
        spawnImage(x, y);
      }
    };

    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target && target.closest && target.closest(".hero-cta-group, .cv-3d-card-wrapper, .hero-cta-btn, a, button")) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const dist = Math.hypot(x - lastPos.current.x, y - lastPos.current.y);
      if (dist > THRESHOLD) {
        lastPos.current = { x, y };
        spawnImage(x, y);
      }
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef, spawnImage]);

  return (
    <div className="hero-image-trail-container" aria-hidden="true">
      {items.map((item) => (
        <div
          key={item.id}
          className="trail-card"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            zIndex: item.zIndex,
            "--card-rot": `${item.rotation}deg`,
            "--card-scale": item.scale,
            "--card-accent": item.data.accent
          }}
        >
          <div className="trail-card-inner">
            <div className="trail-card-img-wrap">
              <img
                src={item.data.img}
                alt={item.data.title}
                loading="eager"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.classList.add("img-fallback");
                }}
              />
              <div className="trail-badge" style={{ borderColor: item.data.accent }}>
                {item.data.tag}
              </div>
            </div>
            <div className="trail-card-footer">
              <span className="trail-card-title">{item.data.title}</span>
              <span className="trail-card-sub">{item.data.caption}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
