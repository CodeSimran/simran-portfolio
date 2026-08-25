import { useState, useEffect } from "react";
import {
  PROJECTS_DATA,
  RESUME_CONFIG,
  getStoredProjects,
  saveStoredProjects,
  getStoredResumeConfig,
  saveStoredResumeConfig,
  extractGoogleDriveId,
  openResumeInNewTab,
  triggerResumeDownload
} from "../data/portfolioData";
import "./Admin.css";

export default function Admin({ onClose }) {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [resumeConfig, setResumeConfig] = useState(RESUME_CONFIG);
  const [saveNotification, setSaveNotification] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setProjects(getStoredProjects());
    setResumeConfig(getStoredResumeConfig());
  }, []);

  const showNotice = (msg) => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(""), 3500);
  };

  const handleResumeFileUpload = (e) => {
    const file = e.target?.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a valid PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const sizeFormatted = file.size < 1024 * 1024
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
      showNotice(`CV uploaded successfully!`);
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
    showNotice("CV removed.");
  };

  const handleResumeChange = (field, value) => {
    setResumeConfig((prev) => {
      const updated = { ...prev, [field]: value };
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
    showNotice("Resume saved successfully!");
  };

  const openNewProjectModal = () => {
    const nextNum = projects.length + 1;
    const numPad = nextNum < 10 ? `0${nextNum}` : nextNum;
    setEditingProject({
      id: `PRJ-${numPad}`,
      title: "",
      category: "Full Stack",
      desc: "",
      thumbnail: "",
      tags: [],
      githubUrl: "",
      liveUrl: "",
      featured: true,
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
      showNotice("Image uploaded!");
    };
    reader.readAsDataURL(file);
  };

  const handleProjectSave = (e) => {
    e.preventDefault();
    if (!editingProject.title.trim()) return;

    let updatedList = [...projects];
    if (editingProject._editIndex !== undefined) {
      const idx = editingProject._editIndex;
      const cleanObj = { ...editingProject };
      delete cleanObj._editIndex;
      updatedList[idx] = cleanObj;
    } else {
      updatedList = [editingProject, ...updatedList];
    }

    setProjects(updatedList);
    saveStoredProjects(updatedList);
    setEditingProject(null);
    showNotice("Project saved!");
  };

  const handleDeleteProject = (index) => {
    if (window.confirm("Delete this project?")) {
      const updated = projects.filter((_, i) => i !== index);
      setProjects(updated);
      saveStoredProjects(updated);
      showNotice("Project deleted.");
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
    if (window.confirm("Reset all to defaults?")) {
      localStorage.removeItem("simran_portfolio_projects");
      localStorage.removeItem("simran_portfolio_resume");
      setProjects(PROJECTS_DATA);
      setResumeConfig(RESUME_CONFIG);
      window.dispatchEvent(new Event("portfolio_data_updated"));
      showNotice("Reset to defaults.");
    }
  };

  return (
    <div className="admin-minimal">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-mark">SK</div>
            {sidebarOpen && (
              <div className="logo-text">
                <h2>Portfolio</h2>
              </div>
            )}
          </div>
          <button 
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle sidebar"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            <span className="nav-icon">📋</span>
            {sidebarOpen && <span className="nav-label">Projects</span>}
          </button>

          <button
            className={`nav-item ${activeTab === "resume" ? "active" : ""}`}
            onClick={() => setActiveTab("resume")}
          >
            <span className="nav-icon">📄</span>
            {sidebarOpen && <span className="nav-label">Resume</span>}
          </button>

          <button
            className={`nav-item ${activeTab === "export" ? "active" : ""}`}
            onClick={() => setActiveTab("export")}
          >
            <span className="nav-icon">⬇️</span>
            {sidebarOpen && <span className="nav-label">Export</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={onClose} className="btn-exit">
            {sidebarOpen ? "Exit Admin" : "←"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Notification */}
        {saveNotification && (
          <div className="notification">
            {saveNotification}
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="tab-pane">
            <div className="content-header">
              <div>
                <h1>Projects</h1>
                <p>{projects.length} project{projects.length !== 1 ? "s" : ""} in your portfolio</p>
              </div>
              <button onClick={openNewProjectModal} className="btn-primary">
                + New Project
              </button>
            </div>

            <div className="projects-list">
              {projects.length === 0 ? (
                <div className="empty-state">
                  <p>No projects yet. Create your first one!</p>
                </div>
              ) : (
                projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="project-item">
                    <div className="project-left">
                      {proj.thumbnail && (
                        <div className="project-thumb">
                          <img src={proj.thumbnail} alt={proj.title} />
                        </div>
                      )}
                    </div>
                    <div className="project-middle">
                      <div className="project-top">
                        <h3>{proj.title}</h3>
                        <span className="project-category">{proj.category}</span>
                      </div>
                      <p className="project-desc">{proj.desc}</p>
                      {proj.tags && proj.tags.length > 0 && (
                        <div className="project-tags">
                          {proj.tags.map((t) => (
                            <span key={t} className="tag">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="project-right">
                      <button
                        onClick={() => handleMoveProject(idx, -1)}
                        disabled={idx === 0}
                        className="btn-small"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleMoveProject(idx, 1)}
                        disabled={idx === projects.length - 1}
                        className="btn-small"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => openEditProjectModal(proj, idx)}
                        className="btn-small edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(idx)}
                        className="btn-small delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* RESUME TAB */}
        {activeTab === "resume" && (
          <div className="tab-pane">
            <div className="content-header">
              <div>
                <h1>Resume & CV</h1>
                <p>Manage your resume upload and settings</p>
              </div>
            </div>

            <form onSubmit={saveResume} className="form-card">
              <div className="form-section">
                <h3>Upload CV</h3>
                {resumeConfig.uploadedFile ? (
                  <div className="file-box">
                    <div className="file-info">
                      <span className="file-icon">📄</span>
                      <div>
                        <p className="file-name">{resumeConfig.uploadedFileName}</p>
                        <p className="file-meta">{resumeConfig.uploadedFileSize} • {resumeConfig.uploadedDate}</p>
                      </div>
                    </div>
                    <div className="file-actions">
                      <button
                        type="button"
                        onClick={() => openResumeInNewTab(resumeConfig)}
                        className="btn-secondary"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerResumeDownload(resumeConfig)}
                        className="btn-secondary"
                      >
                        Download
                      </button>
                      <label className="btn-secondary">
                        Replace
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleResumeFileUpload}
                          style={{ display: "none" }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleClearUploadedResume}
                        className="btn-secondary delete"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`dropzone ${isDraggingFile ? "dragging" : ""}`}
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
                    <p>Drag PDF here or</p>
                    <label className="btn-primary">
                      Choose File
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeFileUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="form-divider"></div>

              <div className="form-section">
                <h3>Google Drive (Backup)</h3>
                <div className="form-group">
                  <label>Share URL</label>
                  <input
                    type="url"
                    value={resumeConfig.driveViewUrl || ""}
                    onChange={(e) => handleResumeChange("driveViewUrl", e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>
                <div className="form-group">
                  <label>File ID</label>
                  <input
                    type="text"
                    value={resumeConfig.driveFileId || ""}
                    onChange={(e) => handleResumeChange("driveFileId", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-divider"></div>

              <div className="form-section">
                <h3>Settings</h3>
                <div className="form-group">
                  <label>Download Filename</label>
                  <input
                    type="text"
                    value={resumeConfig.downloadFileName || ""}
                    onChange={(e) => handleResumeChange("downloadFileName", e.target.value)}
                    placeholder="My_CV.pdf"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status Badge</label>
                  <input
                    type="text"
                    value={resumeConfig.statusBadge || ""}
                    onChange={(e) => handleResumeChange("statusBadge", e.target.value)}
                    placeholder="OFFICIAL CV · 2025"
                  />
                </div>
                <div className="form-group">
                  <label>Professional Role</label>
                  <input
                    type="text"
                    value={resumeConfig.role || ""}
                    onChange={(e) => handleResumeChange("role", e.target.value)}
                    placeholder="Full Stack Developer"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary btn-large">
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* EXPORT TAB */}
        {activeTab === "export" && (
          <div className="tab-pane">
            <div className="content-header">
              <div>
                <h1>Export & Backup</h1>
                <p>Export your data or reset to defaults</p>
              </div>
            </div>

            <div className="form-card">
              <div className="form-section">
                <h3>Export Code</h3>
                <p>Copy this configuration to your code:</p>
                <pre className="code-block">
{`export const RESUME_CONFIG = ${JSON.stringify(resumeConfig, null, 2)};\n\nexport const PROJECTS_DATA = ${JSON.stringify(projects, null, 2)};\n`}
                </pre>
                <button
                  type="button"
                  onClick={() => {
                    const code = `export const RESUME_CONFIG = ${JSON.stringify(resumeConfig, null, 2)};\n\nexport const PROJECTS_DATA = ${JSON.stringify(projects, null, 2)};\n`;
                    navigator.clipboard.writeText(code);
                    showNotice("Code copied!");
                  }}
                  className="btn-primary"
                >
                  Copy to Clipboard
                </button>
              </div>

              <div className="form-divider"></div>

              <div className="form-section danger">
                <h3>Reset</h3>
                <p>Revert all changes to original defaults</p>
                <button type="button" onClick={resetAllToDefaults} className="btn-danger">
                  Reset All
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* EDIT PROJECT MODAL */}
      {editingProject && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingProject._editIndex !== undefined ? "Edit Project" : "Create Project"}</h2>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="btn-close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProjectSave} className="modal-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="Project title"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    placeholder="e.g. Full Stack"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ID</label>
                  <input
                    type="text"
                    value={editingProject.id}
                    onChange={(e) => setEditingProject({ ...editingProject, id: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={editingProject.desc}
                  onChange={(e) => setEditingProject({ ...editingProject, desc: e.target.value })}
                  placeholder="Describe your project..."
                  required
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Thumbnail Image</label>
                <div className="file-input-wrapper">
                  <input
                    type="text"
                    value={editingProject.thumbnail || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                    placeholder="Image URL or upload below"
                  />
                  <label className="btn-secondary">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
                {editingProject.thumbnail && (
                  <div className="img-preview">
                    <img src={editingProject.thumbnail} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Tech Stack</label>
                <div className="tags-input">
                  <div className="tags-display">
                    {editingProject.tags.map((t) => (
                      <span key={t} className="tag-item">
                        {t}
                        <button type="button" onClick={() => handleRemoveTag(t)}>×</button>
                      </span>
                    ))}
                  </div>
                  <div className="tag-input-group">
                    <input
                      type="text"
                      placeholder="Add tech..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    />
                    <button type="button" onClick={handleAddTag} className="btn-secondary">
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input
                    type="url"
                    value={editingProject.githubUrl || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Live Demo URL</label>
                  <input
                    type="url"
                    value={editingProject.liveUrl || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setEditingProject(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProject._editIndex !== undefined ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
