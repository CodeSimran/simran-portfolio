import { useState, useRef } from "react";
import "./Achievements.css";

const SHEETS = [
  {
    id: 0,
    front: {
      type: "hardcover",
      tag: "HONORS & MILESTONES",
      title: "CHRONICLE OF ACHIEVEMENTS",
      subtitle: "Academic, Algorithmic & Engineering Milestones",
      author: "Simran Kumari",
      institution: "Corporate Institute of Science & Technology",
      seal: "★"
    },
    back: {
      type: "index",
      heading: "Table of Achievements",
      intro: "A collection of verified academic accolades, competitive programming triumphs, and full-stack technical certifications.",
      entries: [
        { num: "01", title: "Batch Topper & Academic Rank 1", page: "Page 1" },
        { num: "02", title: "1st Place C++ Coding Championship", page: "Page 2" },
        { num: "03", title: "Top 5% GeeksforGeeks & 500+ LeetCode", page: "Page 3" },
        { num: "04", title: "Full Stack Java & MERN Certification", page: "Page 4" },
      ]
    }
  },
  {
    id: 1,
    front: {
      type: "achievement",
      num: "01",
      badge: "ACADEMIC DISTINCTION",
      title: "Ranked 1st in Academics — Batch Topper",
      subtitle: "B.Tech Computer Science & Engineering",
      cgpa: "CGPA 9.60 / 10.00",
      institution: "Corporate Institute of Science & Technology (CIST), Bhopal",
      highlights: [
        "Maintained Rank 1 across the entire Computer Science department through all 8 semesters.",
        "Consistently highest marks in Data Structures, OS, DBMS, Computer Networks, and Java.",
        "Awarded University Academic Merit Honor for outstanding analytical performance."
      ],
      sealText: "TOP OF BATCH",
      sealColor: "#f59e0b"
    },
    back: {
      type: "detail",
      title: "Academic Focus & Systems Mastery",
      points: [
        { label: "Core Foundation", desc: "Object-Oriented Programming, Algorithm Design, Automata, Compiler Design." },
        { label: "Engineering Excellence", desc: "Built end-to-end coursework projects with robust test coverage." },
        { label: "Peer Mentorship", desc: "Led study circles helping 60+ peers master complex CS subjects." }
      ],
      quote: "“Consistency in fundamentals forms the bedrock of scalable software engineering.”"
    }
  },
  {
    id: 2,
    front: {
      type: "achievement",
      num: "02",
      badge: "CODING CHAMPIONSHIP",
      title: "1st Place, Inter-College C++ Coding Competition",
      subtitle: "State-Level Collegiate Tech Championship",
      cgpa: "Winner · Rank 1 of 100+",
      institution: "Inter-University Technical Arena",
      highlights: [
        "Ranked #1 among 100+ top engineering participants in live multi-round speed coding.",
        "Constructed optimized solutions with minimum time and memory footprint using modern C++.",
        "Solved complex algorithmic graph traversal and dynamic programming rounds without penalty."
      ],
      sealText: "1ST PLACE WINNER",
      sealColor: "#7c6cfa"
    },
    back: {
      type: "detail",
      title: "Competitive Programming Strategy",
      points: [
        { label: "Language Weapon", desc: "Modern C++ (STL, Fast I/O, Bit Manipulation, Custom Comparators)." },
        { label: "Problem Classes", desc: "Graph theory (Dijkstra, BFS/DFS), Two Pointers, Divide & Conquer." },
        { label: "Speed Execution", desc: "Formulating edge cases and debugging runtime complexity in minutes." }
      ],
      quote: "“Speed in coding is the byproduct of crystal-clear algorithmic intuition.”"
    }
  },
  {
    id: 3,
    front: {
      type: "achievement",
      num: "03",
      badge: "DSA & PROBLEM SOLVING",
      title: "Top 5% Global GeeksforGeeks · 500+ LeetCode",
      subtitle: "Competitive Algorithmic Platforms",
      cgpa: "500+ Problems Solved",
      institution: "LeetCode · GeeksforGeeks",
      highlights: [
        "Solved 500+ algorithmic problems spanning Trees, Graphs, Dynamic Programming, and Heaps.",
        "Secured position in the Top 5% percentile on GeeksforGeeks amongst 100,000+ engineers.",
        "Daily problem solver with relentless consistency in data structure optimizations."
      ],
      sealText: "TOP 5% WORLDWIDE",
      sealColor: "#38bdf8"
    },
    back: {
      type: "detail",
      title: "Problem Solving Matrix",
      points: [
        { label: "Dynamic Programming", desc: "Knapsack variants, Matrix DP, String Matching, State Machine DP." },
        { label: "Trees & Graphs", desc: "Trie, Segment Trees, Disjoint Set Union (DSU), Topological Sort." },
        { label: "Platform Ranks", desc: "Consistently high rating in weekly coding contests and hackathons." }
      ],
      quote: "“Every problem solved is a pattern mastered for real-world architecture.”"
    }
  },
  {
    id: 4,
    front: {
      type: "achievement",
      num: "04",
      badge: "INDUSTRY CERTIFICATION",
      title: "Full Stack Development Mastery — JSpider",
      subtitle: "Enterprise Engineering Program",
      cgpa: "Certified Full-Stack Engineer",
      institution: "JSpider Academy of Technology",
      highlights: [
        "Comprehensive enterprise certification in Core Java, Spring Boot, REST Microservices, and MERN.",
        "Built production-ready decoupled architectures with clean DAO, Service, and Controller layers.",
        "Mastered database design, transactions, JDBC, Hibernate/JPA, and React UI integration."
      ],
      sealText: "CERTIFIED EXPERT",
      sealColor: "#10b981"
    },
    back: {
      type: "backcover",
      title: "The Chronicle Closes",
      subtitle: "Ready for high-impact engineering challenges.",
      summary: "Equipped with academic rigor, competitive problem-solving precision, and production-tested full-stack capability.",
      author: "Simran Kumari",
      contactPrompt: "Looking for an engineer who builds systems with precision?"
    }
  }
];

// Play smooth realistic paper rustle sound using Web Audio API
const playFlipSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.18);

    // Soft noise burst for paper texture
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    noise.start();
    noise.stop(ctx.currentTime + 0.16);
  } catch {
    // AudioContext blocked or not supported
  }
};

export default function Achievements() {
  // flippedSheets: Set of sheet indices that are flipped (turned to the left)
  const [flippedSheets, setFlippedSheets] = useState(new Set());
  const [activeFlipping, setActiveFlipping] = useState(null);
  const bookRef = useRef(null);

  const flipSheet = (sheetIndex) => {
    playFlipSound();
    setActiveFlipping(sheetIndex);

    setFlippedSheets((prev) => {
      const next = new Set(prev);
      if (next.has(sheetIndex)) {
        next.delete(sheetIndex);
      } else {
        next.add(sheetIndex);
      }
      return next;
    });

    setTimeout(() => {
      setActiveFlipping(null);
    }, 850);
  };

  const openNext = () => {
    for (let i = 0; i < SHEETS.length; i++) {
      if (!flippedSheets.has(i)) {
        flipSheet(i);
        break;
      }
    }
  };

  const turnPrevious = () => {
    for (let i = SHEETS.length - 1; i >= 0; i--) {
      if (flippedSheets.has(i)) {
        flipSheet(i);
        break;
      }
    }
  };

  const openAll = () => {
    playFlipSound();
    setFlippedSheets(new Set(SHEETS.map((_, i) => i)));
  };

  const closeBook = () => {
    playFlipSound();
    setFlippedSheets(new Set());
  };

  const isBookClosed = flippedSheets.size === 0;
  const isBookEnded = flippedSheets.size === SHEETS.length;

  return (
    <section id="achievements" className="section ach-section">
      <div className="section-inner">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading">Achievements</h2>
            <p className="ach-header-subtitle">
              Interactive 3D Chronicle — Click the right or left pages to physically flip and explore every milestone.
            </p>
          </div>
          <span className="section-num">(★ 3D REAL BOOK)</span>
        </div>
        <div className="section-divider"></div>

        {/* 3D Realistic Book Viewport */}
        <div className="real-book-viewport">
          <div className="book-ambient-glow"></div>
          <div className="book-table-surface"></div>

          <div
            className={`real-3d-book ${isBookClosed ? "book-closed-front" : isBookEnded ? "book-closed-back" : "book-opened"}`}
            ref={bookRef}
          >
            {/* Book Spine / Binding Left */}
            <div className="book-spine-3d">
              <div className="spine-ribs"></div>
              <div className="spine-ribs"></div>
              <div className="spine-ribs"></div>
              <div className="spine-title-vertical">SIMRAN KUMARI · ACHIEVEMENTS</div>
            </div>

            {/* Stacked Pages Thickness Rim (Right & Bottom depth) */}
            <div className="book-page-block-right">
              <div className="stacked-pages-texture"></div>
            </div>
            <div className="book-page-block-bottom"></div>

            {/* Render Each 3D Sheet */}
            {SHEETS.map((sheet, index) => {
              const isFlipped = flippedSheets.has(index);
              const isCurrentlyFlipping = activeFlipping === index;

              // Compute realistic zIndex for 3D stacking
              let zIndex;
              if (isCurrentlyFlipping) {
                zIndex = 50;
              } else if (isFlipped) {
                // When flipped to left, later pages sit on top
                zIndex = index + 1;
              } else {
                // When unflipped on right, earlier pages sit on top
                zIndex = SHEETS.length - index;
              }

              return (
                <div
                  key={sheet.id}
                  className={`book-sheet ${isFlipped ? "flipped" : ""} ${isCurrentlyFlipping ? "flipping" : ""}`}
                  style={{
                    zIndex,
                    "--sheet-index": index
                  }}
                  onClick={() => flipSheet(index)}
                >
                  {/* FRONT OF SHEET */}
                  <div className="sheet-face sheet-front">
                    <div className="paper-gradient-curl"></div>
                    <div className="paper-binding-shadow"></div>

                    {sheet.front.type === "hardcover" && (
                      <div className="hardcover-design">
                        <div className="hardcover-outer-border">
                          <div className="cover-corner c-tl"></div>
                          <div className="cover-corner c-tr"></div>
                          <div className="cover-corner c-bl"></div>
                          <div className="cover-corner c-br"></div>

                          <div className="cover-emblem">
                            <div className="emblem-star">★</div>
                          </div>

                          <span className="cover-kicker">{sheet.front.tag}</span>
                          <h3 className="cover-title-3d">{sheet.front.title}</h3>
                          <p className="cover-sub-3d">{sheet.front.subtitle}</p>

                          <div className="cover-ornament-line"></div>

                          <div className="cover-meta-3d">
                            <span className="author-name-gold">{sheet.front.author}</span>
                            <span className="inst-name-muted">{sheet.front.institution}</span>
                          </div>

                          <div className="cover-flip-callout">
                            <span className="callout-hand">👉</span>
                            <span>Click to Flip Cover</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {sheet.front.type === "achievement" && (
                      <div className="achievement-sheet-content">
                        <div className="sheet-header-bar">
                          <span className="ach-badge-tag" style={{ borderColor: sheet.front.sealColor, color: sheet.front.sealColor }}>
                            {sheet.front.badge}
                          </span>
                          <span className="sheet-num-label">{sheet.front.num} / 04</span>
                        </div>

                        <div className="ach-main-title-wrap">
                          <h3 className="ach-front-title">{sheet.front.title}</h3>
                          <span className="ach-front-subtitle">{sheet.front.subtitle}</span>
                        </div>

                        <div className="ach-score-banner" style={{ borderColor: sheet.front.sealColor }}>
                          <span className="score-label">ACHIEVEMENT METRIC</span>
                          <span className="score-value" style={{ color: sheet.front.sealColor }}>
                            {sheet.front.cgpa}
                          </span>
                          <span className="score-org">{sheet.front.institution}</span>
                        </div>

                        <div className="ach-bullet-points">
                          {sheet.front.highlights.map((pt, pti) => (
                            <div key={pti} className="ach-bullet">
                              <span className="bullet-check" style={{ color: sheet.front.sealColor }}>✔</span>
                              <p>{pt}</p>
                            </div>
                          ))}
                        </div>

                        {/* Gold Wax Seal */}
                        <div className="physical-wax-seal" style={{ borderColor: sheet.front.sealColor, color: sheet.front.sealColor }}>
                          <div className="seal-center">
                            <span className="seal-star">★</span>
                            <span className="seal-text">{sheet.front.sealText}</span>
                          </div>
                        </div>

                        <div className="sheet-turn-hint">
                          <span>Click page to turn ➔</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BACK OF SHEET */}
                  <div className="sheet-face sheet-back">
                    <div className="paper-gradient-curl-back"></div>
                    <div className="paper-binding-shadow-back"></div>

                    {sheet.back.type === "index" && (
                      <div className="index-sheet-content">
                        <div className="index-header">
                          <span className="index-small-tag">PREFACE</span>
                          <h3 className="index-title">{sheet.back.heading}</h3>
                          <p className="index-intro">{sheet.back.intro}</p>
                        </div>

                        <div className="index-entries-list">
                          {sheet.back.entries.map((entry, ei) => (
                            <div key={ei} className="index-entry-row">
                              <span className="entry-num">{entry.num}</span>
                              <span className="entry-name">{entry.title}</span>
                              <span className="entry-dots"></span>
                              <span className="entry-page">{entry.page}</span>
                            </div>
                          ))}
                        </div>

                        <div className="index-footer">
                          <span>Simran Kumari · Academic Archive</span>
                          <span className="turn-back-hint">⟵ Click to close cover</span>
                        </div>
                      </div>
                    )}

                    {sheet.back.type === "detail" && (
                      <div className="detail-sheet-content">
                        <div className="detail-header">
                          <span className="detail-tag">TECHNICAL ARCHIVE</span>
                          <h4 className="detail-title">{sheet.back.title}</h4>
                        </div>

                        <div className="detail-points-group">
                          {sheet.back.points.map((pt, pti) => (
                            <div key={pti} className="detail-point-card">
                              <span className="dp-label">{pt.label}</span>
                              <p className="dp-desc">{pt.desc}</p>
                            </div>
                          ))}
                        </div>

                        <div className="detail-quote-box">
                          <p>{sheet.back.quote}</p>
                        </div>

                        <div className="sheet-turn-back-hint">
                          <span>⟵ Click to turn back</span>
                        </div>
                      </div>
                    )}

                    {sheet.back.type === "backcover" && (
                      <div className="backcover-sheet-content">
                        <div className="backcover-frame">
                          <div className="backcover-crest">★ ★ ★</div>
                          <h3 className="backcover-title">{sheet.back.title}</h3>
                          <p className="backcover-sub">{sheet.back.subtitle}</p>

                          <div className="backcover-summary-box">
                            <p>{sheet.back.summary}</p>
                          </div>

                          <div className="backcover-cta">
                            <span className="cta-prompt">{sheet.back.contactPrompt}</span>
                            <a href="#contact" className="backcover-contact-btn">
                              Get In Touch ➔
                            </a>
                          </div>

                          <span className="turn-back-hint">⟵ Click to flip back</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3D Book Interactive Controls */}
        <div className="book-controls-container">
          <div className="controls-btn-cluster">
            <button
              className="book-ctrl-btn"
              onClick={closeBook}
              disabled={isBookClosed}
              title="Close book to front cover"
            >
              ⇤ Close Book
            </button>

            <button
              className="book-ctrl-btn primary"
              onClick={turnPrevious}
              disabled={isBookClosed}
            >
              ⟵ Turn Page Back
            </button>

            <div className="book-status-pill">
              {isBookClosed ? (
                <span className="status-closed">📖 Book Closed (Front Cover)</span>
              ) : isBookEnded ? (
                <span className="status-ended">🏆 Final Page Reached</span>
              ) : (
                <span className="status-open">
                  📄 Viewing Page {flippedSheets.size} of {SHEETS.length}
                </span>
              )}
            </div>

            <button
              className="book-ctrl-btn primary"
              onClick={openNext}
              disabled={isBookEnded}
            >
              Turn Page Next ➔
            </button>

            <button
              className="book-ctrl-btn"
              onClick={openAll}
              disabled={isBookEnded}
              title="Open directly to back page"
            >
              Open to End ⇥
            </button>
          </div>

          <div className="page-tabs-quicknav">
            {SHEETS.map((_, idx) => {
              const isThisFlipped = flippedSheets.has(idx);
              return (
                <button
                  key={idx}
                  className={`sheet-tab-node ${isThisFlipped ? "flipped-node" : ""}`}
                  onClick={() => flipSheet(idx)}
                  title={`Toggle Sheet ${idx === 0 ? "Cover" : idx}`}
                >
                  <span className="tab-dot"></span>
                  <span className="tab-label">
                    {idx === 0 ? "Cover" : `Ach 0${idx}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
