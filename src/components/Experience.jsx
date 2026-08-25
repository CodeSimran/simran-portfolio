import { useRef, useEffect } from "react";
import "./Experience.css";

const JOBS = [
  {
    index: "01",
    date: "SEP 2024 — PRESENT",
    role: "Technical Mentor",
    company: "Kalvium",
    location: "Bangalore, India",
    color: "#a78bfa",
    colorRgb: "167, 139, 250",
    swingDuration: "3.4s",
    swingDelay: "0s",
    swingAngle: 7,
    chainLength: 100,
    bullets: [
      "Mentoring students in DSA, development, and competitive programming.",
      "Running technical workshops and live coding sessions on real-world dev practices.",
      "Guiding projects and interview prep toward top tech placements."
    ]
  },
  {
    index: "02",
    date: "JAN — MAR 2024",
    role: "Full Stack Dev Intern",
    company: "NeXTIn Technologies",
    location: "Pune, India",
    color: "#34d399",
    colorRgb: "52, 211, 153",
    swingDuration: "2.9s",
    swingDelay: "-1.2s",
    swingAngle: 9,
    chainLength: 130,
    bullets: [
      "Built full-stack web app using React, Node.js, HTML, CSS, JavaScript.",
      "Integrated frontend with backend APIs improving performance & UX.",
      "Collaborated with dev team to optimize app and resolve bugs."
    ]
  },
  {
    index: "03",
    date: "JUN 2022 — SEP 2023",
    role: "Software Dev Intern",
    company: "Resultant (Java)",
    location: "Indianapolis, USA — Remote",
    color: "#fbbf24",
    colorRgb: "251, 191, 36",
    swingDuration: "3.8s",
    swingDelay: "-2.3s",
    swingAngle: 6.5,
    chainLength: 110,
    bullets: [
      "Designed and enhanced a payment interface for seamless transactions.",
      "Built a robust backend module using Java, Spring Boot and REST APIs.",
      "Worked across API development, database management and optimization."
    ]
  }
];

function ChainLink({ color }) {
  return (
    <div className="chain-link" style={{ "--link-color": color }}>
      <div className="link-oval"></div>
    </div>
  );
}

function HangingPendulumItem({ job }) {
  const swingRef = useRef(null);

  useEffect(() => {
    const el = swingRef.current;
    if (!el) return;
    const onEnter = () => (el.style.animationPlayState = "paused");
    const onLeave = () => (el.style.animationPlayState = "running");
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const numLinks = Math.floor(job.chainLength / 18);

  return (
    <div
      className="hanging-column"
      style={{
        "--card-color": job.color,
        "--card-rgb": job.colorRgb,
      }}
    >
      {/* Hook directly anchored to the wall rail */}
      <div className="rail-anchor-hook">
        <div className="hook-bracket"></div>
        <div className="hook-nail"></div>
        <div className="hook-pivot-ring"></div>
      </div>

      {/* Whole Pendulum (Chain + Bell Card) swings from the pivot */}
      <div
        className="pendulum-swing-arm"
        ref={swingRef}
        style={{
          "--swing-angle": `${job.swingAngle}deg`,
          animationDuration: job.swingDuration,
          animationDelay: job.swingDelay,
        }}
      >
        {/* Chain links */}
        <div className="chain" style={{ height: `${job.chainLength}px` }}>
          {Array.from({ length: numLinks }).map((_, li) => (
            <ChainLink key={li} color={job.color} />
          ))}
        </div>

        {/* 3D Bell Clock Card */}
        <div className="bell-card">
          {/* Top arc & crown loop */}
          <div className="bell-crown-loop"></div>
          <div
            className="bell-arc"
            style={{
              background: `linear-gradient(180deg, rgba(${job.colorRgb}, 0.22) 0%, transparent 100%)`,
            }}
          ></div>

          {/* Clapper / Bob hanging underneath */}
          <div className="bell-clapper" style={{ background: job.color }}></div>

          {/* Card face content */}
          <div className="card-face">
            {/* Header */}
            <div className="card-header">
              <span className="card-index" style={{ color: job.color }}>
                #{job.index}
              </span>
              <span className="card-date">{job.date}</span>
            </div>

            {/* Role */}
            <h3 className="card-role">{job.role}</h3>

            {/* Company */}
            <div className="card-company">
              <span className="company-name">{job.company}</span>
              <span className="company-loc">{job.location}</span>
            </div>

            {/* Glowing Accent Divider */}
            <div
              className="card-divider"
              style={{
                background: `linear-gradient(to right, ${job.color}, transparent)`,
              }}
            ></div>

            {/* Experience bullet points */}
            <ul className="card-bullets">
              {job.bullets.map((b, j) => (
                <li key={j}>
                  <span
                    className="cbullet"
                    style={{
                      background: job.color,
                      boxShadow: `0 0 8px ${job.color}`,
                    }}
                  ></span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Holographic light sweep */}
          <div className="card-shine"></div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="section exp-section">
      {/* Wall Texture */}
      <div className="wall-bg"></div>

      <div className="section-inner">
        <div className="section-header-row">
          <h2 className="section-heading">01 Experience</h2>
          <span className="section-num">(01)</span>
        </div>
        <p className="section-subtext">
          Hover over any hanging card to pause the pendulum motion and inspect the details.
        </p>

        {/* Industrial Wall Mount Rail */}
        <div className="wall-rail">
          <div className="rail-bar">
            <div className="rail-bolt rail-bolt-left"></div>
            <div className="rail-bolt rail-bolt-right"></div>
            <div className="rail-texture"></div>
          </div>
        </div>

        {/* Hanging Pendulum Cards Row */}
        <div className="hanging-row">
          {JOBS.map((job, i) => (
            <HangingPendulumItem key={i} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}
