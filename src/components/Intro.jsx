import { useState, useRef, useEffect } from "react";
import "./Intro.css";

const TABS = {
  anyone: "I am Simran — a Bhopal-based full-stack developer and technical mentor who builds backend systems with precision, crafts interfaces with care, and then turns around and teaches others to do the same.",
  recruiters: "B.Tech CSE, CGPA 9.60. Currently a Technical Mentor at Kalvium. Previously: Full Stack intern at NeXTIn Technologies (MERN), Software Developer intern at Resultant, USA (Java/Spring Boot). Open to full-stack engineering roles.",
  engineers: "I work across the full stack — Java + Spring Boot on the backend, React + Node.js on the frontend. I have built payment interfaces, REST APIs, and real-time dashboards. 500+ LeetCode problems. Top 5% on GeeksforGeeks.",
  mentors: "I mentor students in DSA, competitive programming, and real-world dev practices at Kalvium. I run live coding sessions and guide projects from idea to deployment — helping students land placements at top companies."
};

const META = [
  { label: "Drawn by", value: "S. Kumari" },
  { label: "Institution", value: "CIST, Bhopal" },
  { label: "Degree", value: "B.Tech CSE" },
  { label: "CGPA", value: "9.60 / 10" },
];

export default function Intro() {
  const [active, setActive] = useState("anyone");
  const [fade, setFade] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const playVid = () => {
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      }
    };
    playVid();
    window.addEventListener("click", playVid, { once: true });
    window.addEventListener("scroll", playVid, { once: true });
  }, []);

  const switchTab = (key) => {
    if (key === active) return;
    setFade(false);
    setTimeout(() => {
      setActive(key);
      setFade(true);
    }, 180);
  };

  return (
    <section id="intro" className="section intro-section-wrap">
      {/* HIGH VISIBILITY BACKGROUND LAPTOP & TYPING HANDS LAYER */}
      <div className="laptop-typing-bg">
        <video
          ref={videoRef}
          className="typing-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          {/* Direct fast-loading developer typing hands video streams */}
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-programmer-typing-on-a-keyboard-41584-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://cdn.coverr.co/videos/coverr-typing-on-a-laptop-keyboard-2614/1080p.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dynamic 3D Hands Typing Graphic Overlay for instant 100% visibility */}
        <div className="hands-typing-visual-overlay">
          <div className="laptop-chassis">
            <div className="laptop-screen-glow">
              <div className="code-editor-mock">
                <span className="code-token blue">public class</span> <span className="code-token yellow">SimranEngine</span> {"{"}
                <div className="code-indent">
                  <span className="code-token green">@Override</span>
                  <div><span className="code-token purple">void</span> <span className="code-token blue">buildFullStackSystems</span>() {"{"}</div>
                  <div className="code-indent-2"><span className="code-token orange">renderPrecisionUI();</span></div>
                  <div>{"}"}</div>
                </div>
                {"}"}
              </div>
            </div>
            <div className="laptop-base-keyboard">
              <div className="keyboard-grid">
                {Array.from({ length: 48 }).map((_, ki) => (
                  <div key={ki} className={`key-cap k${ki % 6}`}></div>
                ))}
              </div>
              {/* Realistic Animated Human Hands Typing on Keyboard */}
              <div className="hand-left-typing">
                <svg className="human-hand-svg" viewBox="0 0 170 230" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="lhSkinBase" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f7d0b8" />
                      <stop offset="35%" stopColor="#e5ad8d" />
                      <stop offset="75%" stopColor="#c78462" />
                      <stop offset="100%" stopColor="#9c5a38" />
                    </linearGradient>
                    <linearGradient id="lhSkinHighlight" x1="20%" y1="0%" x2="80%" y2="100%">
                      <stop offset="0%" stopColor="#ffeedf" stopOpacity="0.9" />
                      <stop offset="60%" stopColor="#e8b597" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ba7654" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="lhPalmShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#b56f4e" />
                      <stop offset="100%" stopColor="#6e371e" />
                    </linearGradient>
                    <linearGradient id="lhNailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffe6e1" />
                      <stop offset="60%" stopColor="#f3bab0" />
                      <stop offset="100%" stopColor="#db8f80" />
                    </linearGradient>
                    <linearGradient id="lhWatchBand" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1a1824" />
                      <stop offset="50%" stopColor="#353147" />
                      <stop offset="100%" stopColor="#15131e" />
                    </linearGradient>
                    <filter id="lhGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.75" />
                    </filter>
                  </defs>

                  <g filter="url(#lhGlow)">
                    {/* Palm & Forearm Body */}
                    <path
                      d="M 38 230 C 38 185, 29 155, 24 125 C 20 106, 26 95, 34 92 C 44 90, 52 86, 68 83 C 84 80, 102 83, 116 88 C 124 92, 130 104, 126 120 C 138 126, 148 138, 150 154 C 152 172, 136 195, 124 230 Z"
                      fill="url(#lhSkinBase)"
                    />
                    {/* Palm 3D Volume Highlight */}
                    <path
                      d="M 44 220 C 44 180, 36 150, 32 125 C 30 110, 38 100, 48 97 C 60 93, 76 90, 92 92 C 104 94, 114 102, 112 118 C 118 126, 126 142, 122 165 C 118 190, 110 210, 104 220 Z"
                      fill="url(#lhSkinHighlight)"
                    />
                    
                    {/* Subtle Tendons & Knuckle Structure */}
                    <path d="M 108 92 C 103 125, 98 160, 94 195" stroke="#ffebd9" strokeWidth="1.6" strokeOpacity="0.45" strokeLinecap="round" />
                    <path d="M 84 86 C 83 125, 82 160, 80 195" stroke="#ffebd9" strokeWidth="1.8" strokeOpacity="0.5" strokeLinecap="round" />
                    <path d="M 60 89 C 62 125, 66 160, 68 195" stroke="#ffebd9" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
                    <path d="M 38 97 C 44 125, 52 160, 58 195" stroke="#ffebd9" strokeWidth="1.3" strokeOpacity="0.35" strokeLinecap="round" />

                    {/* Knuckle Arch Shadows & Highlights */}
                    <ellipse cx="108" cy="88" rx="7" ry="5" fill="#ffd5be" opacity="0.6" />
                    <ellipse cx="84" cy="83" rx="7.5" ry="5" fill="#ffd5be" opacity="0.6" />
                    <ellipse cx="60" cy="86" rx="7" ry="5" fill="#ffd5be" opacity="0.6" />
                    <ellipse cx="36" cy="94" rx="6" ry="4.5" fill="#ffd5be" opacity="0.55" />

                    {/* Thumb with Natural Joint and Realistic Animation */}
                    <g className="finger-group f-thumb-left">
                      {/* Thumb Body */}
                      <path
                        d="M 120 120 C 128 108, 137 94, 143 78 C 147 66, 137 56, 127 62 C 117 69, 112 85, 108 102 C 105 114, 112 124, 120 120 Z"
                        fill="url(#lhSkinBase)"
                      />
                      <path
                        d="M 122 116 C 128 106, 135 94, 139 80 C 141 72, 135 63, 129 67 C 123 72, 118 84, 114 98 Z"
                        fill="url(#lhSkinHighlight)"
                      />
                      {/* Thumb Knuckle Creases */}
                      <path d="M 124 90 C 130 87, 136 90, 139 94" stroke="#8d4b29" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                      {/* Thumb Nail */}
                      <path
                        d="M 126 66 C 131 62, 138 65, 140 72 C 141 78, 135 81, 129 80 C 125 79, 123 72, 126 66 Z"
                        fill="url(#lhNailGrad)"
                      />
                      <path d="M 128 65 C 133 63, 136 66, 137 69" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
                    </g>

                    {/* Pinky Finger */}
                    <g className="finger-group f-pinky-left">
                      <path
                        d="M 28 94 C 27 72, 30 52, 33 38 C 34 28, 45 28, 46 38 C 47 52, 47 74, 44 94 Z"
                        fill="url(#lhSkinBase)"
                      />
                      <path
                        d="M 31 90 C 30 72, 33 54, 35 40 C 36 34, 42 34, 43 40 C 44 52, 44 72, 41 90 Z"
                        fill="url(#lhSkinHighlight)"
                      />
                      {/* Creases */}
                      <path d="M 30 68 C 36 66, 42 67, 45 70" stroke="#8d4b29" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                      <path d="M 31 49 C 37 47, 43 48, 45 51" stroke="#8d4b29" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                      {/* Pinky Nail */}
                      <ellipse cx="39" cy="35" rx="4.5" ry="5.5" fill="url(#lhNailGrad)" />
                      <path d="M 36 33 C 38 31, 41 31, 42 33" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
                    </g>

                    {/* Ring Finger */}
                    <g className="finger-group f-ring-left">
                      <path
                        d="M 50 86 C 50 58, 54 36, 56 18 C 57 8, 69 8, 70 18 C 72 36, 73 60, 69 86 Z"
                        fill="url(#lhSkinBase)"
                      />
                      <path
                        d="M 53 82 C 53 58, 57 38, 58 20 C 59 13, 66 13, 67 20 C 69 36, 70 58, 66 82 Z"
                        fill="url(#lhSkinHighlight)"
                      />
                      {/* Creases */}
                      <path d="M 52 58 C 59 56, 67 57, 70 60" stroke="#8d4b29" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                      <path d="M 53 36 C 60 34, 67 35, 70 38" stroke="#8d4b29" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                      {/* Ring Nail */}
                      <ellipse cx="63" cy="16" rx="5" ry="6.5" fill="url(#lhNailGrad)" />
                      <path d="M 60 14 C 62 11, 65 11, 66 14" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
                    </g>

                    {/* Middle Finger */}
                    <g className="finger-group f-middle-left">
                      <path
                        d="M 74 84 C 74 54, 77 28, 79 8 C 80 -1, 93 -1, 94 8 C 96 28, 98 56, 94 84 Z"
                        fill="url(#lhSkinBase)"
                      />
                      <path
                        d="M 77 80 C 77 54, 80 30, 81 10 C 82 4, 89 4, 90 10 C 92 28, 94 54, 91 80 Z"
                        fill="url(#lhSkinHighlight)"
                      />
                      {/* Creases */}
                      <path d="M 76 56 C 83 54, 91 55, 95 58" stroke="#8d4b29" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
                      <path d="M 76 60 C 83 58, 91 59, 95 62" stroke="#8d4b29" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                      <path d="M 77 32 C 84 30, 91 31, 95 34" stroke="#8d4b29" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
                      {/* Middle Nail */}
                      <ellipse cx="86.5" cy="7" rx="5.5" ry="7" fill="url(#lhNailGrad)" />
                      <path d="M 83.5 5 C 85.5 2, 89 2, 90 5" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
                    </g>

                    {/* Index Finger */}
                    <g className="finger-group f-index-left">
                      <path
                        d="M 98 88 C 98 62, 102 40, 104 20 C 105 10, 118 10, 119 20 C 121 40, 123 64, 119 88 Z"
                        fill="url(#lhSkinBase)"
                      />
                      <path
                        d="M 101 84 C 101 62, 105 42, 106 22 C 107 15, 114 15, 115 22 C 117 40, 119 62, 116 84 Z"
                        fill="url(#lhSkinHighlight)"
                      />
                      {/* Creases */}
                      <path d="M 100 60 C 108 58, 117 59, 120 62" stroke="#8d4b29" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
                      <path d="M 101 64 C 108 62, 116 63, 119 66" stroke="#8d4b29" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                      <path d="M 101 38 C 108 36, 116 37, 119 40" stroke="#8d4b29" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
                      {/* Index Nail */}
                      <ellipse cx="111.5" cy="18" rx="5.5" ry="6.5" fill="url(#lhNailGrad)" />
                      <path d="M 108.5 16 C 110.5 13, 114 13, 115 16" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
                    </g>

                    {/* Minimalist Smart Watch Band at Wrist */}
                    <rect x="36" y="202" width="88" height="18" rx="4" fill="url(#lhWatchBand)" stroke="#4a4463" strokeWidth="1" />
                    <rect x="68" y="204" width="24" height="14" rx="3" fill="#0d0c13" stroke="#7c6cfa" strokeWidth="0.8" />
                    <line x1="72" y1="211" x2="88" y2="211" stroke="#4ade80" strokeWidth="1" opacity="0.8" />
                  </g>
                </svg>
              </div>

              {/* Right Human Hand */}
              <div className="hand-right-typing">
                <svg className="human-hand-svg" viewBox="0 0 170 230" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="rhSkinBase" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f7d0b8" />
                      <stop offset="35%" stopColor="#e5ad8d" />
                      <stop offset="75%" stopColor="#c78462" />
                      <stop offset="100%" stopColor="#9c5a38" />
                    </linearGradient>
                    <linearGradient id="rhSkinHighlight" x1="80%" y1="0%" x2="20%" y2="100%">
                      <stop offset="0%" stopColor="#ffeedf" stopOpacity="0.9" />
                      <stop offset="60%" stopColor="#e8b597" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ba7654" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="rhNailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffe6e1" />
                      <stop offset="60%" stopColor="#f3bab0" />
                      <stop offset="100%" stopColor="#db8f80" />
                    </linearGradient>
                    <filter id="rhGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.75" />
                    </filter>
                  </defs>

                  <g filter="url(#rhGlow)">
                    {/* Palm & Forearm Body */}
                    <path
                      d="M 132 230 C 132 185, 141 155, 146 125 C 150 106, 144 95, 136 92 C 126 90, 118 86, 102 83 C 86 80, 68 83, 54 88 C 46 92, 40 104, 44 120 C 32 126, 22 138, 20 154 C 18 172, 34 195, 46 230 Z"
                      fill="url(#rhSkinBase)"
                    />
                    {/* Palm 3D Volume Highlight */}
                    <path
                      d="M 126 220 C 126 180, 134 150, 138 125 C 140 110, 132 100, 122 97 C 110 93, 94 90, 78 92 C 66 94, 56 102, 58 118 C 52 126, 44 142, 48 165 C 52 190, 60 210, 66 220 Z"
                      fill="url(#rhSkinHighlight)"
                    />

                    {/* Subtle Tendons & Knuckle Structure */}
                    <path d="M 62 92 C 67 125, 72 160, 76 195" stroke="#ffebd9" strokeWidth="1.6" strokeOpacity="0.45" strokeLinecap="round" />
                    <path d="M 86 86 C 87 125, 88 160, 90 195" stroke="#ffebd9" strokeWidth="1.8" strokeOpacity="0.5" strokeLinecap="round" />
                    <path d="M 110 89 C 108 125, 104 160, 102 195" stroke="#ffebd9" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
                    <path d="M 132 97 C 126 125, 118 160, 112 195" stroke="#ffebd9" strokeWidth="1.3" strokeOpacity="0.35" strokeLinecap="round" />

                    {/* Knuckle Arch Shadows & Highlights */}
                    <ellipse cx="62" cy="88" rx="7" ry="5" fill="#ffd5be" opacity="0.6" />
                    <ellipse cx="86" cy="83" rx="7.5" ry="5" fill="#ffd5be" opacity="0.6" />
                    <ellipse cx="110" cy="86" rx="7" ry="5" fill="#ffd5be" opacity="0.6" />
                    <ellipse cx="134" cy="94" rx="6" ry="4.5" fill="#ffd5be" opacity="0.55" />

                    {/* Thumb with Natural Joint */}
                    <g className="finger-group f-thumb-right">
                      <path
                        d="M 50 120 C 42 108, 33 94, 27 78 C 23 66, 33 56, 43 62 C 53 69, 58 85, 62 102 C 65 114, 58 124, 50 120 Z"
                        fill="url(#rhSkinBase)"
                      />
                      <path
                        d="M 48 116 C 42 106, 35 94, 31 80 C 29 72, 35 63, 41 67 C 47 72, 52 84, 56 98 Z"
                        fill="url(#rhSkinHighlight)"
                      />
                      {/* Thumb Knuckle Creases */}
                      <path d="M 46 90 C 40 87, 34 90, 31 94" stroke="#8d4b29" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                      {/* Thumb Nail */}
                      <path
                        d="M 44 66 C 39 62, 32 65, 30 72 C 29 78, 35 81, 41 80 C 45 79, 47 72, 44 66 Z"
                        fill="url(#rhNailGrad)"
                      />
                      <path d="M 42 65 C 37 63, 34 66, 33 69" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
                    </g>

                    {/* Index Finger */}
                    <g className="finger-group f-index-right">
                      <path
                        d="M 72 88 C 72 62, 68 40, 66 20 C 65 10, 52 10, 51 20 C 49 40, 47 64, 51 88 Z"
                        fill="url(#rhSkinBase)"
                      />
                      <path
                        d="M 69 84 C 69 62, 65 42, 64 22 C 63 15, 56 15, 55 22 C 53 40, 51 62, 54 84 Z"
                        fill="url(#rhSkinHighlight)"
                      />
                      {/* Creases */}
                      <path d="M 70 60 C 62 58, 53 59, 50 62" stroke="#8d4b29" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
                      <path d="M 69 64 C 62 62, 54 63, 51 66" stroke="#8d4b29" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                      <path d="M 69 38 C 62 36, 54 37, 51 40" stroke="#8d4b29" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
                      {/* Index Nail */}
                      <ellipse cx="58.5" cy="18" rx="5.5" ry="6.5" fill="url(#rhNailGrad)" />
                      <path d="M 61.5 16 C 59.5 13, 56 13, 55 16" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
                    </g>

                    {/* Middle Finger */}
                    <g className="finger-group f-middle-right">
                      <path
                        d="M 96 84 C 96 54, 93 28, 91 8 C 90 -1, 77 -1, 76 8 C 74 28, 72 56, 76 84 Z"
                        fill="url(#rhSkinBase)"
                      />
                      <path
                        d="M 93 80 C 93 54, 90 30, 89 10 C 88 4, 81 4, 80 10 C 78 28, 76 54, 79 80 Z"
                        fill="url(#rhSkinHighlight)"
                      />
                      {/* Creases */}
                      <path d="M 94 56 C 87 54, 79 55, 75 58" stroke="#8d4b29" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
                      <path d="M 94 60 C 87 58, 79 59, 75 62" stroke="#8d4b29" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
                      <path d="M 93 32 C 86 30, 79 31, 75 34" stroke="#8d4b29" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
                      {/* Middle Nail */}
                      <ellipse cx="83.5" cy="7" rx="5.5" ry="7" fill="url(#rhNailGrad)" />
                      <path d="M 86.5 5 C 84.5 2, 81 2, 80 5" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
                    </g>

                    {/* Ring Finger */}
                    <g className="finger-group f-ring-right">
                      <path
                        d="M 120 86 C 120 58, 116 36, 114 18 C 113 8, 101 8, 100 18 C 98 36, 97 60, 101 86 Z"
                        fill="url(#rhSkinBase)"
                      />
                      <path
                        d="M 117 82 C 117 58, 113 38, 112 20 C 111 13, 104 13, 103 20 C 101 36, 100 58, 104 82 Z"
                        fill="url(#rhSkinHighlight)"
                      />
                      {/* Creases */}
                      <path d="M 118 58 C 111 56, 103 57, 100 60" stroke="#8d4b29" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                      <path d="M 117 36 C 110 34, 103 35, 100 38" stroke="#8d4b29" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                      {/* Ring Nail */}
                      <ellipse cx="107" cy="16" rx="5" ry="6.5" fill="url(#rhNailGrad)" />
                      <path d="M 110 14 C 108 11, 105 11, 104 14" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
                    </g>

                    {/* Pinky Finger */}
                    <g className="finger-group f-pinky-right">
                      <path
                        d="M 142 94 C 143 72, 140 52, 137 38 C 136 28, 125 28, 124 38 C 123 52, 123 74, 126 94 Z"
                        fill="url(#rhSkinBase)"
                      />
                      <path
                        d="M 139 90 C 140 72, 137 54, 135 40 C 134 34, 128 34, 127 40 C 126 52, 126 72, 129 90 Z"
                        fill="url(#rhSkinHighlight)"
                      />
                      {/* Creases */}
                      <path d="M 140 68 C 134 66, 128 67, 125 70" stroke="#8d4b29" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                      <path d="M 139 49 C 133 47, 127 48, 125 51" stroke="#8d4b29" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                      {/* Pinky Nail */}
                      <ellipse cx="131" cy="35" rx="4.5" ry="5.5" fill="url(#rhNailGrad)" />
                      <path d="M 134 33 C 132 31, 129 31, 128 33" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
                    </g>

                    {/* Subtle sleek wrist accessory */}
                    <path d="M 46 212 C 70 216, 108 216, 132 212" stroke="#d4af37" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Dark Vignette Masks to keep text legible */}
        <div className="typing-vignette-overlay"></div>
      </div>

      <div className="section-inner intro-layout">
        <div className="intro-left">
          <div className="intro-badge">
            <span className="live-typing-dot"></span>
            ACTIVE CODING IN BACKGROUND
          </div>
          <h2 className="section-heading">Intro</h2>
          <ul className="intro-tabs">
            {Object.keys(TABS).map((k) => (
              <li
                key={k}
                className={`intro-tab${active === k ? " active" : ""}`}
                onClick={() => switchTab(k)}
              >
                {k === "anyone" ? "For anyone" : k.charAt(0).toUpperCase() + k.slice(1)}
              </li>
            ))}
          </ul>
        </div>

        <div className="intro-right">
          <div className="intro-card">
            <div className="card-fold"></div>
            <div className="card-ambient-glow"></div>
            <p className="intro-text" style={{ opacity: fade ? 1 : 0, transition: "opacity 0.2s" }}>
              {TABS[active]}
            </p>
          </div>
        </div>
      </div>

      <div className="drawn-block">
        {META.map((m) => (
          <div key={m.label} className="drawn-item">
            <span className="drawn-label">{m.label}</span>
            <span className="drawn-value">{m.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
