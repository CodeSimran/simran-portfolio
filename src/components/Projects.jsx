import { useState, useEffect } from "react";
import { getStoredProjects } from "../data/portfolioData";
import "./Projects.css";

export default function Projects() {
  const [projectsList, setProjectsList] = useState(getStoredProjects());
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const handleDataUpdate = () => {
      setProjectsList(getStoredProjects());
    };
    window.addEventListener("portfolio_data_updated", handleDataUpdate);
    return () => window.removeEventListener("portfolio_data_updated", handleDataUpdate);
  }, []);

  useEffect(() => {
    if (projectsList.length <= 1) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % projectsList.length), 6000);
    return () => clearInterval(timer);
  }, [projectsList.length]);

  const prev = () => setCurrent(c => (c - 1 + projectsList.length) % projectsList.length);
  const next = () => setCurrent(c => (c + 1) % projectsList.length);

  return (
    <section id="projects" className="section">
      <div className="section-inner">
        <div className="section-header-row">
          <h2 className="section-heading">02 Projects</h2>
          <span className="section-num">({projectsList.length < 10 ? `0${projectsList.length}` : projectsList.length})</span>
        </div>
        <p className="section-desc">Precision-engineered systems and interfaces built for real-world use.</p>
        <div className="section-divider"></div>
      </div>

      <div className="projects-carousel">
        {projectsList.length > 1 && (
          <>
            <button className="carousel-btn prev" onClick={prev} aria-label="Previous project">&#8592;</button>
            <button className="carousel-btn next" onClick={next} aria-label="Next project">&#8594;</button>
          </>
        )}

        <div className="carousel-viewport">
          <div className="carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
            {projectsList.map((p, i) => (
              <div key={p.id || i} className="project-slide">
                <div className="project-card">
                  <div className={`project-card-image ${p.colorClass || `p0${(i % 4) + 1}`}`}>
                    <span className="project-badge">{p.id}</span>
                    {p.category && <span className="project-category-badge">{p.category}</span>}

                    {/* Project Thumbnail Image or SVG Graphic */}
                    {p.thumbnail || p.image ? (
                      <div className="project-thumb-wrap">
                        <img
                          src={p.thumbnail || p.image}
                          alt={p.title}
                          className="project-thumb-img"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = "none";
                            const fallback = e.target.parentElement.querySelector(".project-img-inner");
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                        <div className="project-thumb-scrim"></div>
                        <div className="project-img-inner project-fallback-icon" style={{ display: "none" }}>
                          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                          </svg>
                          <p>{p.title}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="project-img-inner">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2">
                          {i % 3 === 0 ? (
                            <>
                              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                              <polyline points="9 22 9 12 15 12 15 22"/>
                            </>
                          ) : i % 3 === 1 ? (
                            <>
                              <rect x="2" y="3" width="20" height="14" rx="2"/>
                              <path d="M8 21h8M12 17v4"/>
                              <path d="M7 8h10M7 12h6"/>
                            </>
                          ) : (
                            <>
                              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                              <polyline points="2 17 12 22 22 17"/>
                              <polyline points="2 12 12 17 22 12"/>
                            </>
                          )}
                        </svg>
                        <p>{p.title}</p>
                      </div>
                    )}
                  </div>

                  <div className="project-card-body">
                    <h3 className="project-title">{p.title}</h3>
                    <p className="project-desc-text">{p.desc}</p>
                    <div className="project-tags">
                      {p.tags?.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>

                    <div className="project-links-row">
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="project-link project-link-github">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                          <span>GitHub Repository ↗</span>
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="project-link project-link-live">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                          <span>Live Demo ↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {projectsList.length > 1 && (
          <div className="carousel-tabs">
            {projectsList.map((p, i) => (
              <button key={p.id || i} className={`carousel-tab${current === i ? " active" : ""}`} onClick={() => setCurrent(i)}>
                {p.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
