import { useState } from "react";
import "./Skills.css";

// Spaced out organic coordinates along tree boughs
const INITIAL_LEAVES = [
  // BRANCH 1: Left Lower Bough — Core Languages & DSA
  { id: 1, name: "C++", type: "tech", level: "Batch Topper (1st)", desc: "DSA, Speed & Algorithmic Foundations", x: 10, y: 64, rot: -45, scale: 1.05 },
  { id: 2, name: "HTML5 / CSS3", type: "tech", level: "Proficient", desc: "Modern Responsive UI & 3D Styling", x: 19, y: 58, rot: -32, scale: 0.95 },
  { id: 3, name: "Java", type: "tech", level: "Core Strength", desc: "OOP, Concurrency & Enterprise Systems", x: 28, y: 52, rot: -18, scale: 1.15 },
  { id: 4, name: "JavaScript", type: "tech", level: "Advanced", desc: "ES6+, Async, DOM & REST Integrations", x: 37, y: 47, rot: -6, scale: 1.05 },

  // BRANCH 2: Left Upper Bough — Frameworks & Architecture
  { id: 5, name: "Bootstrap", type: "tech", level: "Proficient", desc: "Rapid Grid Systems & Layouts", x: 11, y: 38, rot: -52, scale: 0.9 },
  { id: 6, name: "React.js", type: "tech", level: "Advanced", desc: "Hooks, SPA, Component State & Lifecycle", x: 20, y: 30, rot: -36, scale: 1.15 },
  { id: 7, name: "Spring Boot", type: "tech", level: "Advanced", desc: "Microservices, Spring Security & REST APIs", x: 30, y: 23, rot: -22, scale: 1.15 },
  { id: 8, name: "Node.js", type: "tech", level: "Proficient", desc: "Backend runtime, Express & NPM", x: 40, y: 18, rot: -10, scale: 1.0 },

  // BRANCH 3: Canopy Crown — Soft Skills, Mentorship & Leadership
  { id: 9, name: "Workshop Facilitation", type: "soft", level: "Mentorship", desc: "Interactive Live Coding & Tech Talks", x: 35, y: 9, rot: -18, scale: 1.0 },
  { id: 10, name: "Technical Mentorship", type: "soft", level: "Active (Kalvium)", desc: "Mentored 100+ Engineers in DSA & Dev", x: 45, y: 5, rot: -4, scale: 1.2 },
  { id: 11, name: "DSA & Problem Solving", type: "soft", level: "500+ LeetCode", desc: "Top 5% on GeeksforGeeks", x: 55, y: 5, rot: 6, scale: 1.15 },
  { id: 12, name: "Agile & Team Leadership", type: "soft", level: "Collaborative", desc: "Cross-functional Sprint Delivery", x: 65, y: 9, rot: 18, scale: 1.05 },
  { id: 13, name: "Code Review & Quality", type: "soft", level: "Best Practices", desc: "Clean Code & Scalable Architecture", x: 50, y: 15, rot: 0, scale: 1.0 },

  // BRANCH 4: Right Upper Bough — Databases & Persistence
  { id: 14, name: "Oracle DB", type: "tech", level: "Proficient", desc: "Enterprise SQL & Transactions", x: 60, y: 18, rot: 10, scale: 1.0 },
  { id: 15, name: "MySQL", type: "tech", level: "Advanced", desc: "Relational Queries & Index Optimization", x: 70, y: 23, rot: 22, scale: 1.1 },
  { id: 16, name: "MongoDB", type: "tech", level: "Proficient", desc: "Document Schemas & Mongoose", x: 80, y: 30, rot: 36, scale: 1.05 },
  { id: 17, name: "REST APIs", type: "tech", level: "Expert", desc: "Secure Endpoints, JWT & JSON Architecture", x: 89, y: 38, rot: 50, scale: 1.0 },

  // BRANCH 5: Right Lower Bough — Developer Tools & Ecosystem
  { id: 18, name: "Maven", type: "tech", level: "Proficient", desc: "Java Builds, POM & Dependencies", x: 63, y: 47, rot: 8, scale: 0.95 },
  { id: 19, name: "Git & GitHub", type: "tech", level: "Advanced", desc: "Version Control, Workflows & Branches", x: 72, y: 52, rot: 20, scale: 1.1 },
  { id: 20, name: "Postman", type: "tech", level: "Proficient", desc: "API Mocking, Testing & Environments", x: 81, y: 58, rot: 34, scale: 1.0 },
  { id: 21, name: "Effective Communication", type: "soft", level: "Core Strength", desc: "Clear Technical Dialogue & Client Empathy", x: 90, y: 64, rot: 46, scale: 1.05 },
];

export default function Skills() {
  const [leaves, setLeaves] = useState(
    INITIAL_LEAVES.map((l) => ({ ...l, status: "growing" }))
  );
  const [filterType, setFilterType] = useState("all");
  const [activeLeaf, setActiveLeaf] = useState(null);
  const [fallenPile, setFallenPile] = useState([]);

  // Trigger individual leaf drying & falling
  const makeLeafFall = (id) => {
    setLeaves((prev) =>
      prev.map((leaf) => {
        if (leaf.id === id && leaf.status === "growing") {
          return { ...leaf, status: "falling" };
        }
        return leaf;
      })
    );

    setTimeout(() => {
      setLeaves((prev) => {
        const fallenLeaf = prev.find((l) => l.id === id);
        if (fallenLeaf) {
          setFallenPile((pile) => [
            ...pile,
            {
              ...fallenLeaf,
              pileX: Math.max(8, Math.min(92, fallenLeaf.x + (Math.random() * 12 - 6))),
              pileRot: Math.random() * 70 - 35,
            },
          ]);
        }
        return prev.map((l) => (l.id === id ? { ...l, status: "fallen" } : l));
      });
    }, 2600);
  };

  // Shake tree: makes 3-4 random leaves dry and fall down
  const shakeTree = () => {
    const activeOnTree = leaves.filter((l) => l.status === "growing");
    if (activeOnTree.length === 0) {
      regrowAllLeaves();
      return;
    }
    const toFall = [...activeOnTree]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(4, activeOnTree.length));

    toFall.forEach((l, idx) => {
      setTimeout(() => {
        makeLeafFall(l.id);
      }, idx * 250);
    });
  };

  // Regrow all leaves back on tree
  const regrowAllLeaves = () => {
    setFallenPile([]);
    setLeaves(INITIAL_LEAVES.map((l) => ({ ...l, status: "growing" })));
  };

  return (
    <section id="skills" className="section skills-section">
      <div className="section-inner">
        <div className="section-header-row">
          <h2 className="section-heading">03 Skills Tree</h2>
          <span className="section-num">(03)</span>
        </div>

        <div className="skills-tree-header-row">
          <p className="skills-tree-desc">
            An organic <strong>3D Living Tree of Knowledge</strong>. Technical expertise and mentorship strengths
            grow like vibrant leaves on deep-rooted branches. Click any leaf or shake the tree to see dry leaves
            flutter down to the ground.
          </p>

          {/* Interactive controls */}
          <div className="tree-action-bar">
            <div className="filter-pill-group">
              <button
                className={`tree-btn ${filterType === "all" ? "active" : ""}`}
                onClick={() => setFilterType("all")}
              >
                🌿 All Leaves ({leaves.length})
              </button>
              <button
                className={`tree-btn tech-btn ${filterType === "tech" ? "active" : ""}`}
                onClick={() => setFilterType("tech")}
              >
                <span className="dot tech-dot"></span> Tech Stack (15)
              </button>
              <button
                className={`tree-btn soft-btn ${filterType === "soft" ? "active" : ""}`}
                onClick={() => setFilterType("soft")}
              >
                <span className="dot soft-dot"></span> Soft Skills &amp; Mentorship (6)
              </button>
            </div>

            <div className="tree-manipulation-group">
              <button className="tree-action-btn shake-btn" onClick={shakeTree}>
                🍃 Shake Tree (Dry Leaves Fall)
              </button>
              <button className="tree-action-btn regrow-btn" onClick={regrowAllLeaves}>
                🌱 Regrow Canopy
              </button>
            </div>
          </div>
        </div>

        {/* 3D TREE STAGE */}
        <div className="tree-canvas-stage">
          <div className="tree-sunlight-rays"></div>
          <div className="forest-spore s1"></div>
          <div className="forest-spore s2"></div>
          <div className="forest-spore s3"></div>
          <div className="forest-spore s4"></div>

          {/* 3D TREE SVG */}
          <svg
            className="organic-tree-svg"
            viewBox="0 0 1000 700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="trunkBark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4a3b32" />
                <stop offset="35%" stopColor="#2e221b" />
                <stop offset="70%" stopColor="#1a120e" />
                <stop offset="100%" stopColor="#2f2119" />
              </linearGradient>

              <radialGradient id="rootPedestalGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(74, 222, 128, 0.22)" />
                <stop offset="60%" stopColor="rgba(124, 108, 250, 0.08)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Root Mound Glow */}
            <ellipse cx="500" cy="650" rx="400" ry="45" fill="url(#rootPedestalGlow)" />

            {/* Roots */}
            <path
              d="M470 630 Q420 660 320 670 M530 630 Q580 660 680 670 M500 635 Q500 680 510 690 M450 635 Q380 680 260 685 M550 635 Q620 680 740 685"
              stroke="#2a1d17"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M480 630 Q440 665 350 675 M520 630 Q560 665 650 675"
              stroke="#4a372c"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Main Central Trunk */}
            <path
              d="M440 640 Q470 480 475 360 Q480 240 485 140 L515 140 Q520 240 525 360 Q530 480 560 640 Z"
              fill="url(#trunkBark)"
            />

            {/* Bark Lines */}
            <path d="M470 610 Q485 490 490 380 Q495 270 498 160" stroke="#5c493f" strokeWidth="2.5" opacity="0.6" />
            <path d="M530 610 Q515 490 510 380 Q505 270 502 160" stroke="#1d1410" strokeWidth="2.5" opacity="0.8" />
            <path d="M500 620 Q500 480 500 320" stroke="#3d2d25" strokeWidth="3" opacity="0.7" />

            {/* BRANCH 1: Lower Left Bough (Languages) */}
            <path
              d="M475 420 C420 410 340 430 200 470 C140 490 80 530 60 550 C120 500 240 460 360 440 C430 430 465 435 470 445 Z"
              fill="url(#trunkBark)"
            />
            <path d="M320 440 C260 420 180 430 130 450" stroke="#3d2d25" strokeWidth="6" strokeLinecap="round" />

            {/* BRANCH 2: Upper Left Bough (Frameworks) */}
            <path
              d="M480 300 C430 260 330 240 210 260 C150 270 90 310 70 340 C130 290 240 270 350 275 C420 280 465 295 480 315 Z"
              fill="url(#trunkBark)"
            />
            <path d="M310 270 C240 220 160 210 110 230" stroke="#3d2d25" strokeWidth="7" strokeLinecap="round" />

            {/* BRANCH 3: Canopy Crown Spikes (Soft Skills & Mentorship) */}
            <path d="M485 150 C460 110 420 80 360 70 C410 85 450 110 470 140 Z" fill="url(#trunkBark)" />
            <path d="M515 150 C540 110 580 80 640 70 C590 85 550 110 530 140 Z" fill="url(#trunkBark)" />
            <path d="M495 140 C490 80 495 50 500 30 C505 50 510 80 505 140 Z" fill="url(#trunkBark)" />

            {/* BRANCH 4: Upper Right Bough (Databases) */}
            <path
              d="M520 300 C570 260 670 240 790 260 C850 270 910 310 930 340 C870 290 760 270 650 275 C580 280 535 295 520 315 Z"
              fill="url(#trunkBark)"
            />
            <path d="M690 270 C760 220 840 210 890 230" stroke="#3d2d25" strokeWidth="7" strokeLinecap="round" />

            {/* BRANCH 5: Lower Right Bough (Tools) */}
            <path
              d="M525 420 C580 410 660 430 800 470 C860 490 920 530 940 550 C880 500 760 460 640 440 C570 430 535 435 530 445 Z"
              fill="url(#trunkBark)"
            />
            <path d="M680 440 C740 420 820 430 870 450" stroke="#3d2d25" strokeWidth="6" strokeLinecap="round" />

            {/* Branch Category Badges on Bark */}
            <text x="170" y="445" fill="#a7f3d0" fontSize="12" fontFamily="monospace" letterSpacing="1.5" opacity="0.85">
              🌿 LANGUAGES
            </text>
            <text x="180" y="250" fill="#c4b5fd" fontSize="12" fontFamily="monospace" letterSpacing="1.5" opacity="0.85">
              ⚡ FRAMEWORKS
            </text>
            <text x="400" y="38" fill="#fde68a" fontSize="13" fontWeight="bold" fontFamily="monospace" letterSpacing="2" opacity="0.95">
              ✨ MENTORSHIP &amp; LEADERSHIP
            </text>
            <text x="710" y="250" fill="#fed7aa" fontSize="12" fontFamily="monospace" letterSpacing="1.5" opacity="0.85">
              🗄️ DATABASES
            </text>
            <text x="730" y="445" fill="#bae6fd" fontSize="12" fontFamily="monospace" letterSpacing="1.5" opacity="0.85">
              🛠️ DEV TOOLS
            </text>
          </svg>

          {/* LIVING LEAVES */}
          <div className="tree-foliage-layer">
            {leaves.map((leaf) => {
              if (leaf.status === "fallen") return null;

              const isMatch = filterType === "all" || filterType === leaf.type;
              const isFalling = leaf.status === "falling";
              const isSoft = leaf.type === "soft";

              return (
                <div
                  key={leaf.id}
                  className={`leaf-node ${leaf.type}-leaf ${isFalling ? "falling-leaf" : ""} ${
                    !isMatch ? "filtered-dim" : ""
                  }`}
                  style={{
                    left: `${leaf.x}%`,
                    top: `${leaf.y}%`,
                    "--leaf-rot": `${leaf.rot}deg`,
                    "--leaf-scale": leaf.scale,
                  }}
                  onClick={() => makeLeafFall(leaf.id)}
                  onMouseEnter={() => setActiveLeaf(leaf)}
                  onMouseLeave={() => setActiveLeaf(null)}
                >
                  <div className="leaf-stem"></div>
                  <div className={`leaf-blade ${isSoft ? "soft-blade" : "tech-blade"}`}>
                    <div className="leaf-midrib"></div>
                    <div className="leaf-caption">
                      <span className="leaf-name">{leaf.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FALLEN DRY LEAVES ON GROUND */}
          <div className="fallen-leaves-ground">
            <div className="mossy-soil-bed"></div>
            {fallenPile.map((item, idx) => (
              <div
                key={`pile-${item.id}-${idx}`}
                className="dry-fallen-leaf"
                style={{
                  left: `${item.pileX}%`,
                  transform: `rotate(${item.pileRot}deg)`,
                }}
                title={`${item.name} (${item.level}) — Fallen leaf enriching the soil`}
              >
                <div className="dry-leaf-shape">
                  <span>{item.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* HOVER LEAF DETAIL CARD */}
          {activeLeaf && activeLeaf.status === "growing" && (
            <div
              className="leaf-detail-card"
              style={{
                left: `${Math.min(76, Math.max(16, activeLeaf.x))}%`,
                top: `${Math.max(6, activeLeaf.y - 14)}%`,
              }}
            >
              <div className="card-top-row">
                <span className={`leaf-type-badge ${activeLeaf.type}`}>
                  {activeLeaf.type === "tech" ? "Technical Skill" : "Mentorship & Soft Skill"}
                </span>
                <span className="leaf-level-text">{activeLeaf.level}</span>
              </div>
              <h4 className="leaf-card-title">{activeLeaf.name}</h4>
              <p className="leaf-card-desc">{activeLeaf.desc}</p>
              <div className="leaf-card-hint">🍂 Click leaf to dry it out and make it fall</div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="tree-legend-strip">
          <div className="legend-item">
            <span className="legend-swatch tech-swatch"></span>
            <span>Technical Leaves (Java, Spring Boot, React, C++, Databases...)</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch soft-swatch"></span>
            <span>Mentorship &amp; Soft Strengths (Kalvium Mentorship, DSA, Leadership...)</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch dry-swatch"></span>
            <span>Autumn Dry Leaves (Click any leaf to shed onto the ground)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
