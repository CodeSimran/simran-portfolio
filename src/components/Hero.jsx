import { useRef, useState, useEffect } from "react";
import HeroImageTrail from "./HeroImageTrail";
import { getStoredResumeConfig, openResumeInNewTab, triggerResumeDownload } from "../data/portfolioData";
import "./Hero.css";

export default function Hero() {
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [downloading, setDownloading] = useState(false);
  const [resume, setResume] = useState(getStoredResumeConfig());

  useEffect(() => {
    const handleUpdate = () => {
      setResume(getStoredResumeConfig());
    };
    window.addEventListener("portfolio_data_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_data_updated", handleUpdate);
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    setTiltStyle({
      transform: `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`,
      transition: "transform 0.1s ease-out",
    });

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.75,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
    });
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    setDownloading(true);
    triggerResumeDownload(resume);

    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    openResumeInNewTab(resume);
  };

  return (
    <section id="hero" ref={heroRef}>
      {/* Interactive Cursor Image Trail (jingjinghan.com effect) */}
      <HeroImageTrail containerRef={heroRef} />

      <div className="hero-content">
        <div className="hero-badge-interactive">
          <span className="hero-badge-dot"></span>
          <span>Hover anywhere to reveal visual archives</span>
        </div>
        <h1 className="hero-title">
          <span className="title-word">Full Stack</span>
          <br />
          <span className="title-word title-accent">Developer</span>
        </h1>
        <p className="hero-subtitle">
          B.Tech Computer Science engineer (CGPA 9.60) specializing in Java,<br/>
          Spring Boot and the MERN stack — designing backend systems<br/>
          and interfaces built for precision, then mentoring the next<br/>
          set of engineers to build the same way.
        </p>

        <div className="hero-cta-group">
          <a href="#projects" className="hero-cta-btn">
            <span>View<br/>Projects</span>
          </a>

          {/* 3D Interactive Floating CV Card with View + Download Features */}
          <div
            className="cv-3d-card-wrapper"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={tiltStyle}
          >
            <div className="cv-3d-card">
              {/* Dynamic Holographic Glare */}
              <div
                className="cv-3d-glare"
                style={{
                  background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.35) 0%, rgba(124, 108, 250, 0.18) 40%, transparent 80%)`,
                  opacity: glarePos.opacity,
                }}
              />

              {/* 3D Depth Layer 1: Ambient Background Plate */}
              <div className="cv-3d-bg-layer">
                <div className="cv-grid-pattern"></div>
                <div className="cv-ambient-blob"></div>
              </div>

              {/* 3D Depth Layer 2: Document Core */}
              <div className="cv-3d-mid-layer">
                <div className="cv-doc-icon-wrap">
                  <div className="cv-3d-sheet">
                    <div className="sheet-fold"></div>
                    <div className="sheet-lines">
                      <div className="s-line l1"></div>
                      <div className="s-line l2"></div>
                      <div className="s-line l3"></div>
                    </div>
                  </div>
                  <span className="cv-format-tag">PDF · 3D</span>
                </div>

                <div className="cv-meta-wrap">
                  <div className="cv-top-row">
                    <span className="cv-badge-live">
                      <span className="cv-pulse-dot"></span>
                      {resume.statusBadge || "OFFICIAL CV"}
                    </span>
                  </div>
                  <div className="cv-author-name">Curriculum Vitae</div>
                  <div className="cv-author-role">{resume.role || "Simran Kumari · Full Stack"}</div>
                </div>
              </div>

              {/* 3D Depth Layer 3: Dual Action Buttons (View + Download) */}
              <div className="cv-3d-front-layer">
                {/* View / Preview Button */}
                <button
                  type="button"
                  onClick={handlePreview}
                  className="cv-btn-action cv-btn-view"
                  title="Preview CV Document"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>Preview</span>
                </button>

                {/* Direct Download Button */}
                <button
                  type="button"
                  onClick={handleDownload}
                  className={`cv-btn-action cv-btn-download${downloading ? " downloading" : ""}`}
                  title="Download PDF directly"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>{downloading ? "Downloading..." : "Download"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="hero-scroll-indicator">
            <span className="scroll-label">SCROLL</span>
            <div className="scroll-line"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
