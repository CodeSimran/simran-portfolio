import { useState, useEffect } from "react";
import {
  PROJECTS_DATA,
  RESUME_CONFIG,
  getStoredProjects,
  saveStoredProjects,
  getStoredResumeConfig,
  saveStoredResumeConfig,
  extractGoogleDriveId,
  getResumeDownloadUrl,
  openResumeInNewTab,
  triggerResumeDownload
} from "../data/portfolioData";
import "./Admin.css";

export default function Admin({ onClose }) {
  // Tab State: 'projects' | 'resume' | 'export'
  const [activeTab, setActiveTab] = useState("projects");

  // Projects State
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null); // null = not editing, object = editing or new
  const [tagInput, setTagInput] = useState("");

  // Resume State
  const [resumeConfig, setResumeConfig] = useState(RESUME_CONFIG);
  const [saveNotification, setSaveNotification] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Initialize
  useEffect(() => {
    setProjects(getStoredProjects());
    setResumeConfig(getStoredResumeConfig());
  }, []);

  const showNotice = (msg) => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(""), 3500);
  };

  // --- RESUME HANDLERS ---
  const handleResumeFileUpload = (e) => {
    const file = e.target?.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a valid PDF file for your CV / Resume.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please compress the PDF or use the Google Drive link.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const sizeFormatted =
        file.size < 1024 * 1024
          ? `${(file.size / 1024).toFixed(1)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      const uploadDate = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      setResumeConfig((prev) => ({
        ...prev,
        uploadedFile: event.target.result,
        uploadedFileName: file.name,
        uploadedFileSize: sizeFormatted,
        uploadedDate: uploadDate,
        downloadFileName: prev.downloadFileName || file.name,
      }));
      showNotice(`Latest CV file "${file.name}" loaded! Remember to click "Save Resume Changes".`);
    };
    reader.readAsDataURL(file);
  };

  const handleClearUploadedResume = () => {
    setResumeConfig((prev) => ({
      ...prev,
      uploadedFile: "",
      uploadedFileName: "",
      uploadedFileSize: "",
      uploadedDate: "",
    }));
    showNotice("Uploaded CV removed (using Google Drive fallback link).");
  };

  const handleResumeChange = (field, value) => {
    setResumeConfig((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-extract ID if user pasted full Drive link into driveFileId
      if (field === "driveFileId" && value.includes("drive.google.com")) {
        updated.driveFileId = extractGoogleDriveId(value);
      }
      if (field === "driveViewUrl" && !updated.driveFileId) {
        updated.driveFileId = extractGoogleDriveId(value);
      }
      return updated;
    });
  };

  const saveResume = (e) => {
    e.preventDefault();
    saveStoredResumeConfig(resumeConfig);
    showNotice("Resume & CV configuration published to portfolio successfully!");
  };

  // --- PROJECT HANDLERS ---
  const openNewProjectModal = () => {
    const nextNum = projects.length + 1;
    const numPad = nextNum < 10 ? `0${nextNum}` : nextNum;
    setEditingProject({
      id: `PRJ-${numPad} · ${new Date().getFullYear()}`,
      title: "",
      category: "Full Stack",
      desc: "",
      thumbnail: "",
      tags: ["React", "Spring Boot", "REST API"],
      githubUrl: "https://github.com/CodeSimran",
      liveUrl: "",
      featured: true,
      colorClass: `p0${((nextNum - 1) % 4) + 1}`,
      accentColor: "#7c6cfa"
    });
    setTagInput("");
  };

  const openEditProjectModal = (proj, index) => {
    setEditingProject({
      ...proj,
      thumbnail: proj.thumbnail || proj.image || "",
      _editIndex: index
    });
    setTagInput("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setEditingProject((prev) => ({
        ...prev,
        thumbnail: event.target.result
      }));
      showNotice("Thumbnail uploaded!");
    };
    reader.readAsDataURL(file);
  };

  const handleProjectSave = (e) => {
    e.preventDefault();
    if (!editingProject.title.trim()) return;

    let updatedList = [...projects];
    if (editingProject._editIndex !== undefined) {
      // Edit existing
      const idx = editingProject._editIndex;
      const cleanObj = { ...editingProject };
      delete cleanObj._editIndex;
      updatedList[idx] = cleanObj;
    } else {
      // Add new at top
      updatedList = [editingProject, ...updatedList];
    }

    setProjects(updatedList);
    saveStoredProjects(updatedList);
    setEditingProject(null);
    showNotice("Project saved and published to portfolio!");
  };

  const handleDeleteProject = (index) => {
    if (window.confirm(`Are you sure you want to delete "${projects[index].title}"?`)) {
      const updated = projects.filter((_, i) => i !== index);
      setProjects(updated);
      saveStoredProjects(updated);
      showNotice("Project removed.");
    }
  };

  const handleMoveProject = (index, dir) => {
    const targetIdx = index + dir;
    if (targetIdx < 0 || targetIdx >= projects.length) return;
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setProjects(updated);
    saveStoredProjects(updated);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!editingProject.tags.includes(tagInput.trim())) {
      setEditingProject({
        ...editingProject,
        tags: [...editingProject.tags, tagInput.trim()]
      });
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditingProject({
      ...editingProject,
      tags: editingProject.tags.filter((t) => t !== tagToRemove)
    });
  };

  const resetAllToDefaults = () => {
    if (window.confirm("Reset all projects and resume to original defaults? This will overwrite local changes.")) {
      localStorage.removeItem("simran_portfolio_projects");
      localStorage.removeItem("simran_portfolio_resume");
      setProjects(PROJECTS_DATA);
      setResumeConfig(RESUME_CONFIG);
      window.dispatchEvent(new Event("portfolio_data_updated"));
      showNotice("Reset to defaults successfully.");
    }
  };

  // --- ADMIN DASHBOARD ---
  return (
    <div className="admin-dashboard-screen">
      {/* Top Navigation */}
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-logo">
            <span className="logo-sq">SK</span>
            <span className="logo-text">Portfolio Admin Manager</span>
          </div>
          <span className="admin-status-pill">LIVE SYNC ACTIVE</span>
        </div>

        <div className="admin-header-right">
          <button type="button" onClick={onClose} className="admin-btn-ghost" title="View live portfolio">
            View Live Site ↗
          </button>
          <button type="button" onClick={onClose} className="admin-btn-outline" title="Close admin panel">
            ← Exit Admin
          </button>
        </div>
      </header>

      {/* Global Notification Banner */}
      {saveNotification && (
        <div className="admin-notice-banner">
          <span>✓ {saveNotification}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="admin-body">
        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button
            className={`admin-nav-tab${activeTab === "projects" ? " active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <span>Projects Manager ({projects.length})</span>
          </button>

          <button
            className={`admin-nav-tab${activeTab === "resume" ? " active" : ""}`}
            onClick={() => setActiveTab("resume")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <span>Resume & CV Config</span>
          </button>

          <button
            className={`admin-nav-tab${activeTab === "export" ? " active" : ""}`}
            onClick={() => setActiveTab("export")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>Export Code / Backup</span>
          </button>
        </div>

        {/* TAB 1: PROJECTS MANAGER */}
        {activeTab === "projects" && (
          <div className="admin-tab-content">
            <div className="admin-content-header">
              <div>
                <h3 className="admin-sec-title">Manage Projects</h3>
                <p className="admin-sec-sub">
                  Add your latest projects or update existing ones. Changes take effect on the live portfolio instantly.
                </p>
              </div>
              <button type="button" onClick={openNewProjectModal} className="admin-btn-accent">
                + Add New Project
              </button>
            </div>

            {/* Projects List Grid */}
            <div className="admin-projects-grid">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="admin-proj-card">
                  <div className="admin-proj-card-top">
                    <div className="admin-proj-badges">
                      <span className="admin-proj-id">{proj.id}</span>
                      {proj.category && <span className="admin-proj-cat">{proj.category}</span>}
                    </div>
                    <div className="admin-proj-card-actions">
                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, -1)}
                        disabled={idx === 0}
                        title="Move Up (Show Earlier)"
                        className="admin-icon-btn"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, 1)}
                        disabled={idx === projects.length - 1}
                        title="Move Down"
                        className="admin-icon-btn"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditProjectModal(proj, idx)}
                        className="admin-icon-btn edit"
                        title="Edit Project"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(idx)}
                        className="admin-icon-btn delete"
                        title="Delete Project"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Project Thumbnail Image Preview & Control */}
                  {proj.thumbnail && (
                    <div className="admin-proj-thumb-preview">
                      <img src={proj.thumbnail} alt={proj.title} />
                    </div>
                  )}

                  <h4 className="admin-proj-title">{proj.title}</h4>
                  <p className="admin-proj-desc">{proj.desc}</p>

                  <div className="admin-proj-tags">
                    {proj.tags?.map((t) => (
                      <span key={t} className="admin-mini-tag">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="admin-proj-links">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="admin-link-sm">
                        GitHub ↗
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="admin-link-sm live">
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: RESUME CONFIG */}
        {activeTab === "resume" && (
          <div className="admin-tab-content">
            <div className="admin-content-header">
              <div>
                <h3 className="admin-sec-title">Resume & CV Control</h3>
                <p className="admin-sec-sub">
                  Upload your latest PDF CV directly or connect via Google Drive. All 3D cards, Navbar buttons, and download triggers will update across the live portfolio instantly.
                </p>
              </div>
            </div>

            <form onSubmit={saveResume} className="admin-form-panel">
              {/* PRIMARY OPTION: DIRECT PDF UPLOAD */}
              <div className="admin-cv-upload-card">
                <div className="admin-cv-upload-header">
                  <div className="admin-cv-upload-title-wrap">
                    <span className="admin-cv-icon-pill">PDF</span>
                    <div>
                      <h4 className="admin-cv-upload-title">Direct PDF Document Upload</h4>
                      <p className="admin-cv-upload-desc">
                        Upload your latest CV file from your computer. No external hosting required.
                      </p>
                    </div>
                  </div>
                  {resumeConfig.uploadedFile && (
                    <span className="admin-cv-live-tag">
                      <span className="admin-pulse-dot"></span> DIRECT FILE ACTIVE
                    </span>
                  )}
                </div>

                {resumeConfig.uploadedFile ? (
                  <div className="admin-cv-active-file-box">
                    <div className="admin-cv-file-details">
                      <div className="admin-cv-doc-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      </div>
                      <div className="admin-cv-file-meta">
                        <span className="admin-cv-file-name">
                          {resumeConfig.uploadedFileName || "Uploaded_CV_Document.pdf"}
                        </span>
                        <div className="admin-cv-file-sub">
                          {resumeConfig.uploadedFileSize && (
                            <span className="admin-cv-size-badge">{resumeConfig.uploadedFileSize}</span>
                          )}
                          {resumeConfig.uploadedDate && (
                            <span className="admin-cv-date">Uploaded: {resumeConfig.uploadedDate}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="admin-cv-file-actions">
                      <button
                        type="button"
                        onClick={() => openResumeInNewTab(resumeConfig)}
                        className="admin-btn-sm"
                        title="Preview uploaded PDF"
                      >
                        👁 Preview PDF ↗
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerResumeDownload(resumeConfig)}
                        className="admin-btn-sm download"
                        title="Test file download"
                      >
                        ⬇ Test Download
                      </button>
                      <label className="admin-btn-sm change-file">
                        📁 Replace File
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={handleResumeFileUpload}
                          style={{ display: "none" }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleClearUploadedResume}
                        className="admin-btn-danger-sm"
                        title="Remove uploaded file"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`admin-cv-dropzone${isDraggingFile ? " dragging" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(true);
                    }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(false);
                      handleResumeFileUpload(e);
                    }}
                  >
                    <div className="admin-dropzone-icon">📁</div>
                    <h5 className="admin-dropzone-title">Click or Drag & Drop Latest CV (PDF)</h5>
                    <p className="admin-dropzone-sub">
                      Supports PDF documents up to 5MB. Stored locally with live real-time sync.
                    </p>
                    <label className="admin-file-upload-btn-lg">
                      <span>Choose PDF File</span>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleResumeFileUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* SECONDARY OPTION: GOOGLE DRIVE FALLBACK */}
              <div className="admin-form-section-divider">
                <span>OR GOOGLE DRIVE LINK (FALLBACK)</span>
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Google Drive View / Share URL</label>
                  <input
                    type="url"
                    value={resumeConfig.driveViewUrl || ""}
                    onChange={(e) => handleResumeChange("driveViewUrl", e.target.value)}
                    placeholder="https://drive.google.com/file/d/YOUR_ID/view?usp=sharing"
                  />
                  <small>Used if no direct PDF file is uploaded.</small>
                </div>

                <div className="admin-field">
                  <label>Google Drive File ID</label>
                  <input
                    type="text"
                    value={resumeConfig.driveFileId || ""}
                    onChange={(e) => handleResumeChange("driveFileId", e.target.value)}
                    placeholder="e.g. 1Pe6IOe8ko2F0WShscSCvbnv6mpocl9Fu"
                  />
                  <small>Auto-extracted from share URL for 1-click export.</small>
                </div>
              </div>

              {/* RESUME METADATA */}
              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Download Filename (When user downloads)</label>
                  <input
                    type="text"
                    value={resumeConfig.downloadFileName || ""}
                    onChange={(e) => handleResumeChange("downloadFileName", e.target.value)}
                    placeholder="Simran_Kumari_CV.pdf"
                    required
                  />
                </div>

                <div className="admin-field">
                  <label>Status Badge Text (3D Card & Header)</label>
                  <input
                    type="text"
                    value={resumeConfig.statusBadge || ""}
                    onChange={(e) => handleResumeChange("statusBadge", e.target.value)}
                    placeholder="OFFICIAL CV · 2025"
                  />
                </div>
              </div>

              <div className="admin-field">
                <label>Professional Role Subtitle</label>
                <input
                  type="text"
                  value={resumeConfig.role || ""}
                  onChange={(e) => handleResumeChange("role", e.target.value)}
                  placeholder="Full Stack Developer & Technical Mentor"
                />
              </div>

              {/* Direct Download & View Test Box */}
              <div className="admin-cv-preview-box">
                <span className="preview-label">Live Test Portfolio Triggers:</span>
                <button
                  type="button"
                  onClick={() => openResumeInNewTab(resumeConfig)}
                  className="admin-btn-sm"
                >
                  Test View / Preview ↗
                </button>
                <button
                  type="button"
                  onClick={() => triggerResumeDownload(resumeConfig)}
                  className="admin-btn-sm download"
                >
                  Test 1-Click Download ⬇
                </button>
              </div>

              <div className="admin-form-footer">
                <button type="submit" className="admin-btn-accent">
                  Save Resume Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: EXPORT / CODE BACKUP */}
        {activeTab === "export" && (
          <div className="admin-tab-content">
            <div className="admin-content-header">
              <div>
                <h3 className="admin-sec-title">Code Export & Backup</h3>
                <p className="admin-sec-sub">
                  Copy this generated code to <code>src/data/portfolioData.js</code> if you want to hardcode your latest changes into Git.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const code = `export const RESUME_CONFIG = ${JSON.stringify(resumeConfig, null, 2)};\n\nexport const PROJECTS_DATA = ${JSON.stringify(projects, null, 2)};\n`;
                  navigator.clipboard.writeText(code);
                  showNotice("Configuration copied to clipboard!");
                }}
                className="admin-btn-accent"
              >
                Copy Code to Clipboard
              </button>
            </div>

            <pre className="admin-code-preview">
              {`// Generated Configuration for src/data/portfolioData.js\n\n`}
              {`export const RESUME_CONFIG = ${JSON.stringify(resumeConfig, null, 2)};\n\n`}
              {`export const PROJECTS_DATA = ${JSON.stringify(projects, null, 2)};\n`}
            </pre>

            <div className="admin-danger-zone">
              <h4>Reset Options</h4>
              <p>Revert all changes back to initial workspace code.</p>
              <button type="button" onClick={resetAllToDefaults} className="admin-btn-danger">
                Reset All to Defaults
              </button>
            </div>
          </div>
        )}
      </div>

      {/* EDIT / CREATE PROJECT MODAL */}
      {editingProject && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>{editingProject._editIndex !== undefined ? "Edit Project" : "Add New Project"}</h3>
              <button type="button" onClick={() => setEditingProject(null)} className="admin-close-btn">
                ✕
              </button>
            </div>

            <form onSubmit={handleProjectSave} className="admin-modal-form">
              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="e.g. AI-Powered Management Engine"
                    required
                  />
                </div>

                <div className="admin-field">
                  <label>Category *</label>
                  <input
                    type="text"
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    placeholder="e.g. Full Stack, Backend, MERN"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label>ID / Badge (e.g. PRJ-015 · 2025)</label>
                  <input
                    type="text"
                    value={editingProject.id}
                    onChange={(e) => setEditingProject({ ...editingProject, id: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-field">
                  <label>Theme Style (Card Color)</label>
                  <select
                    value={editingProject.colorClass || "p01"}
                    onChange={(e) => setEditingProject({ ...editingProject, colorClass: e.target.value })}
                  >
                    <option value="p01">Purple Glow (p01)</option>
                    <option value="p02">Blue Navy (p02)</option>
                    <option value="p03">Emerald Green (p03)</option>
                    <option value="p04">Pink Magenta (p04)</option>
                  </select>
                </div>
              </div>

              {/* Project Thumbnail Image Section */}
              <div className="admin-field">
                <label>Project Thumbnail Image (URL or Upload File)</label>
                <div className="admin-thumb-inputs">
                  <input
                    type="text"
                    value={editingProject.thumbnail || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                    placeholder="Paste Image URL (https://...) or upload image file below"
                  />
                  <div className="admin-file-upload-wrap">
                    <label className="admin-file-upload-btn">
                      📁 Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                    {editingProject.thumbnail && (
                      <button
                        type="button"
                        onClick={() => setEditingProject({ ...editingProject, thumbnail: "" })}
                        className="admin-btn-ghost-sm"
                      >
                        Clear Image
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Image Preview in Modal */}
                {editingProject.thumbnail && (
                  <div className="admin-modal-thumb-preview">
                    <img
                      src={editingProject.thumbnail}
                      alt="Thumbnail Preview"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <span className="thumb-preview-tag">✓ Thumbnail Active</span>
                  </div>
                )}
              </div>

              <div className="admin-field">
                <label>Project Description *</label>
                <textarea
                  rows={3}
                  value={editingProject.desc}
                  onChange={(e) => setEditingProject({ ...editingProject, desc: e.target.value })}
                  placeholder="Describe key features, engineering decisions, and impact..."
                  required
                />
              </div>

              {/* Tags Input */}
              <div className="admin-field">
                <label>Tech Stack Tags</label>
                <div className="admin-tags-wrap">
                  {editingProject.tags.map((t) => (
                    <span key={t} className="admin-editable-tag">
                      {t}
                      <button type="button" onClick={() => handleRemoveTag(t)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="admin-tag-input-row">
                  <input
                    type="text"
                    placeholder="Type tech tag (e.g. Docker, TypeScript) and press Add..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <button type="button" onClick={handleAddTag} className="admin-btn-sm">
                    + Add Tag
                  </button>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label>GitHub Repository URL</label>
                  <input
                    type="url"
                    value={editingProject.githubUrl || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/CodeSimran/your-repo"
                  />
                </div>

                <div className="admin-field">
                  <label>Live Demo URL (Optional)</label>
                  <input
                    type="url"
                    value={editingProject.liveUrl || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    placeholder="https://your-demo.vercel.app"
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" onClick={() => setEditingProject(null)} className="admin-btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="admin-btn-accent">
                  {editingProject._editIndex !== undefined ? "Save Changes" : "Publish Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
