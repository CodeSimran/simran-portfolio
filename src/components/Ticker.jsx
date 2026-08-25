import "./Ticker.css";
const SKILLS = ["Java","Spring Boot","React","Node.js","REST APIs","MongoDB","MySQL","C++","JavaScript","DSA","Git / GitHub","Technical Mentorship"];
export default function Ticker() {
  const doubled = [...SKILLS, ...SKILLS];
  return (
    <div className="ticker-wrapper" aria-hidden="true">
      <div className="ticker-track">
        {doubled.map((s, i) => (
          <span key={i} className="ticker-item">
            {s}<span className="ticker-dot"> · </span>
          </span>
        ))}
      </div>
    </div>
  );
}
