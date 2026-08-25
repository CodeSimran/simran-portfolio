/**
 * =========================================================================
 * SIMRAN KUMARI PORTFOLIO - CENTRAL DATA CONFIGURATION
 * =========================================================================
 * 
 * NOTE FOR ADMIN:
 * You can manage projects & CV directly through your secret admin portal (/admin)
 * or by editing this file directly.
 * =========================================================================
 */

export const RESUME_CONFIG = {
  // Direct uploaded file (Base64 data URL)
  uploadedFile: "",
  uploadedFileName: "",
  uploadedFileSize: "",
  uploadedDate: "",

  // Google Drive share link for online preview (Fallback)
  driveViewUrl: "https://drive.google.com/file/d/1Pe6IOe8ko2F0WShscSCvbnv6mpocl9Fu/view?usp=sharing",
  
  // Google Drive File ID
  driveFileId: "1Pe6IOe8ko2F0WShscSCvbnv6mpocl9Fu",
  
  // Direct Download filename
  downloadFileName: "Simran_Kumari_CV.pdf",
  
  // Display metadata
  role: "Full Stack Developer & Technical Mentor",
  statusBadge: "OFFICIAL CV · 2025",
  degree: "B.Tech CSE · CGPA 9.60",
  verified: true
};

/**
 * Extracts Google Drive ID from any URL format or returns raw ID
 */
export const extractGoogleDriveId = (urlOrId = "") => {
  if (!urlOrId) return "";
  const match = urlOrId.match(/\/d\/([a-zA-Z0-9_-]+)/) || urlOrId.match(/id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : urlOrId.trim();
};

/**
 * Returns direct download link for Google Drive PDF
 */
export const getResumeDownloadUrl = (fileId = "") => {
  const targetId = fileId || getStoredResumeConfig().driveFileId || RESUME_CONFIG.driveFileId;
  return `https://drive.google.com/uc?export=download&id=${targetId}`;
};

/**
 * Opens CV/Resume in a new browser tab (handles uploaded Base64 PDF blobs and Google Drive URLs)
 */
export const openResumeInNewTab = (resumeConfig) => {
  const config = resumeConfig || getStoredResumeConfig();
  if (config?.uploadedFile) {
    try {
      const parts = config.uploadedFile.split(",");
      const mime = parts[0].match(/data:(.*?);/)?.[1] || "application/pdf";
      const byteCharacters = atob(parts[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      return;
    } catch (err) {
      console.error("Error opening uploaded CV blob:", err);
    }
  }

  if (config?.driveViewUrl) {
    window.open(config.driveViewUrl, "_blank");
  }
};

/**
 * Initiates direct download of the current active resume (uploaded PDF or Drive export)
 */
export const triggerResumeDownload = (resumeConfig) => {
  const config = resumeConfig || getStoredResumeConfig();
  const fileName = config.downloadFileName || config.uploadedFileName || "Simran_Kumari_CV.pdf";

  if (config?.uploadedFile) {
    try {
      const link = document.createElement("a");
      link.href = config.uploadedFile;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    } catch (err) {
      console.error("Error triggering uploaded file download:", err);
    }
  }

  const link = document.createElement("a");
  link.href = getResumeDownloadUrl(config?.driveFileId);
  link.target = "_blank";
  link.rel = "noreferrer";
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * PROJECTS LIST (Defaults)
 */
export const PROJECTS_DATA = [
  {
    id: "PRJ-015 · 2024",
    title: "Full-Stack Enterprise Management Suite",
    category: "MERN Stack",
    desc: "Production-ready full-stack enterprise web application built at NeXTIn Technologies featuring secure JWT authentication, dynamic dashboard analytics, role-based access control, and optimized RESTful APIs.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "JWT"],
    githubUrl: "https://github.com/CodeSimran",
    liveUrl: "https://github.com/CodeSimran",
    featured: true,
    colorClass: "p03",
    accentColor: "#10b981"
  },
  {
    id: "PRJ-014 · NOV 2022",
    title: "Hotel Management Rental System",
    category: "Full Stack",
    desc: "Web-based hotel management system streamlining room booking, customer check-in/out, and room allocation, with a menu-driven console interface for real-time room status tracking and billing.",
    thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    tags: ["Java v1.8", "HTML5", "CSS3", "JavaScript", "REST API", "MySQL"],
    githubUrl: "https://github.com/CodeSimran/HotelManagementRentalSystem",
    liveUrl: "https://github.com/CodeSimran/HotelManagementRentalSystem",
    featured: true,
    colorClass: "p01",
    accentColor: "#7c6cfa"
  },
  {
    id: "PRJ-009 · SEP 2021",
    title: "US IT Consulting Services Web-Portal",
    category: "Enterprise Backend",
    desc: "Client-facing portal for US-based IT consulting firm (Resultant) featuring a secure multi-role login system, real-time developer activity dashboard, payment evaluation engine, and high-performance microservices.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    tags: ["Java 8", "Spring Boot", "Maven", "REST API", "Microservices", "Security"],
    githubUrl: "https://github.com/CodeSimran",
    liveUrl: "https://www.resultantech.com/",
    featured: true,
    colorClass: "p02",
    accentColor: "#38bdf8"
  },
  {
    id: "PRJ-008 · 2023",
    title: "Algorithmic Problem-Solving & DSA Hub",
    category: "Algorithms & Core",
    desc: "Curated repository of 500+ optimized algorithmic solutions across LeetCode and GeeksforGeeks (Top 5% rank), focusing on Dynamic Programming, Graph Theory, and Tree traversal patterns with detailed complexity benchmarks.",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    tags: ["C++", "Java", "Data Structures", "Algorithms", "Dynamic Programming"],
    githubUrl: "https://github.com/CodeSimran",
    liveUrl: "https://leetcode.com/",
    featured: false,
    colorClass: "p04",
    accentColor: "#ec4899"
  }
];

// --- DYNAMIC STORAGE GETTERS & SETTERS (WITH LIVE EVENT DISPATCH) ---
export const getStoredProjects = () => {
  try {
    const saved = localStorage.getItem("simran_portfolio_projects");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return PROJECTS_DATA;
};

export const saveStoredProjects = (projects) => {
  try {
    localStorage.setItem("simran_portfolio_projects", JSON.stringify(projects));
    window.dispatchEvent(new Event("portfolio_data_updated"));
  } catch (e) {
    console.error(e);
  }
};

export const getStoredResumeConfig = () => {
  try {
    const saved = localStorage.getItem("simran_portfolio_resume");
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return RESUME_CONFIG;
};

export const saveStoredResumeConfig = (config) => {
  try {
    localStorage.setItem("simran_portfolio_resume", JSON.stringify(config));
    window.dispatchEvent(new Event("portfolio_data_updated"));
  } catch (e) {
    console.error(e);
  }
};
