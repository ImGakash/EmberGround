import { useState } from "react";
import "./App.css";

function App() {
  // Input state
  const [applicationId, setApplicationId] = useState("");

  // Application / Case state
  const [caseData, setCaseData] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  // Track application
  const handleTrackApplication = () => {
    if (!applicationId.trim()) {
      setError("Please enter an application or reference ID.");
      return;
    }

    setError("");
    setLoading(true);

    // Temporary mock data
    setTimeout(() => {
      setCaseData({
        applicationId: applicationId,
        service: "Government Service",
        applicantStatus: "SUBMITTED",
        submittedAt: "2026-09-10",
        lastUpdated: "2026-09-10",
        monitoring: true,
        understanding:
          "The application has been submitted, but no final outcome has been recorded yet.",
        nextAction:
          "Continue monitoring the application and check the official status if no update appears.",
        evidence: [
          {
            id: 1,
            name: "Application Receipt",
            type: "document",
          },
          {
            id: 2,
            name: "Payment Receipt",
            type: "document",
          },
        ],
        timeline: [
          {
            id: 1,
            date: "2026-09-10",
            title: "Application submitted",
            description: "The application was submitted.",
          },
          {
            id: 2,
            date: "2026-09-10",
            title: "Documents received",
            description: "Required documents were recorded.",
          },
        ],
      });

      setLoading(false);
    }, 800);
  };

  // Check application status
  const handleCheckStatus = () => {
    if (!caseData) return;

    setError("");
    setChecking(true);

    setTimeout(() => {
      const previousStatus = caseData.applicantStatus;
      const newStatus =
        previousStatus === "SUBMITTED"
          ? "UNDER_PROCESSING"
          : previousStatus;

      const statusChanged = previousStatus !== newStatus;

      setCaseData((previousCase) => ({
        ...previousCase,
        applicantStatus: newStatus,
        lastUpdated: new Date().toISOString().split("T")[0],
        timeline: statusChanged
          ? [
              ...previousCase.timeline,
              {
                id: previousCase.timeline.length + 1,
                date: new Date().toISOString().split("T")[0],
                title: "Application status updated",
                description: `${previousStatus} → ${newStatus}`,
              },
            ]
          : [
              ...previousCase.timeline,
              {
                id: previousCase.timeline.length + 1,
                date: new Date().toISOString().split("T")[0],
                title: "Status checked",
                description: "No status change was detected.",
              },
            ],
        understanding: statusChanged
          ? "A change in the application's status has been detected."
          : "No change in the application's status was detected.",
        nextAction: statusChanged
          ? "Review the updated status and determine whether any action is required."
          : "Continue monitoring the application and follow up if the expected processing period is exceeded.",
      }));

      setChecking(false);
    }, 1200);
  };

  // Turn monitoring on/off
  const handleToggleMonitoring = () => {
    if (!caseData) return;

    setCaseData((previousCase) => ({
      ...previousCase,
      monitoring: !previousCase.monitoring,
    }));
  };

  // Reset application
  const handleNewApplication = () => {
    setApplicationId("");
    setCaseData(null);
    setError("");
    setLoading(false);
    setChecking(false);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-logo-wrapper">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <div className="brand-text">
            <div className="title-row">
              <h1>Nagrik</h1>
              <span className="badge-pill">Citizen Hub</span>
            </div>
            <p className="app-subtitle">Track your application and understand what happens next.</p>
          </div>
        </div>
      </header>

      {/* Application Input Screen */}
      {!caseData && (
        <div className="search-view">
          <section className="search-card">
            <div className="card-hero-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            
            <h2>Track an Application</h2>
            <p className="search-description">
              Enter your official application or reference number to access real-time status updates and intelligent next-step guidance.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTrackApplication();
              }}
              className="search-form"
            >
              <div className="input-group">
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <input
                  type="text"
                  className="search-input"
                  value={applicationId}
                  onChange={(event) => setApplicationId(event.target.value)}
                  placeholder="e.g. NAG-883921"
                />
                <button
                  type="submit"
                  className="btn btn-primary track-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <span>Track Application</span>
                      <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="error-banner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="demo-hint">
              <span className="hint-label">Try sample ID:</span>
              <button
                type="button"
                className="sample-chip"
                onClick={() => setApplicationId("NAG-2026-9812")}
              >
                NAG-2026-9812
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Case Information Dashboard */}
      {caseData && (
        <main className="dashboard-content">
          {/* Service Banner Header Card */}
          <section className="card summary-banner-card">
            <div className="summary-banner-top">
              <div className="service-title-group">
                <span className="category-tag">Public Service Record</span>
                <h2>{caseData.service}</h2>
              </div>
              <div className={`status-pill status-${caseData.applicantStatus.toLowerCase()}`}>
                <span className="status-dot"></span>
                <span>{caseData.applicantStatus.replace("_", " ")}</span>
              </div>
            </div>

            <div className="meta-grid">
              <div className="meta-box">
                <span className="meta-label">Application ID</span>
                <code className="app-id-code">{caseData.applicationId}</code>
              </div>

              <div className="meta-box">
                <span className="meta-label">Date Submitted</span>
                <span className="meta-value">{caseData.submittedAt}</span>
              </div>

              <div className="meta-box">
                <span className="meta-label">Last Status Update</span>
                <span className="meta-value">{caseData.lastUpdated}</span>
              </div>
            </div>
          </section>

          {/* 2-Column Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Left Column: Monitoring + Insights */}
            <div className="grid-column column-left">
              {/* Status Monitoring Card */}
              <section className="card action-card-group">
                <div className="card-header">
                  <div className="card-icon-bubble icon-blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                  <div className="card-header-titles">
                    <h3>Application Monitoring</h3>
                    <p className="card-subtitle">Automated background status updates</p>
                  </div>
                </div>

                <div className="monitoring-status-bar">
                  <span className="status-indicator">
                    Monitoring:
                  </span>
                  <span className={`monitoring-tag ${caseData.monitoring ? "active" : "paused"}`}>
                    <span className="pulse-dot"></span>
                    {caseData.monitoring ? "Active" : "Paused"}
                  </span>
                </div>

                <div className="button-row">
                  <button
                    onClick={handleToggleMonitoring}
                    className={`btn ${caseData.monitoring ? "btn-secondary" : "btn-accent"}`}
                  >
                    {caseData.monitoring ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="6" y="4" width="4" height="16"/>
                          <rect x="14" y="4" width="4" height="16"/>
                        </svg>
                        <span>Pause Monitoring</span>
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                        <span>Start Monitoring</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCheckStatus}
                    disabled={checking}
                    className="btn btn-primary"
                  >
                    {checking ? (
                      <>
                        <span className="spinner"></span>
                        <span>Checking...</span>
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21.5 2v6h-6M2.5 22v-6h6"/>
                          <path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8M22 12.5a10 10 0 0 1-18.8 4.2L2.5 16"/>
                        </svg>
                        <span>Check for Update</span>
                      </>
                    )}
                  </button>
                </div>
              </section>

              {/* Nagrik Understanding Card */}
              <section className="card insight-card">
                <div className="card-header">
                  <div className="card-icon-bubble icon-purple">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                  </div>
                  <div className="card-header-titles">
                    <h3>What Nagrik Understands</h3>
                    <p className="card-subtitle">AI-synthesized current status explanation</p>
                  </div>
                </div>

                <div className="insight-box">
                  <p className="insight-text">{caseData.understanding}</p>
                </div>
              </section>

              {/* Next Action Card */}
              <section className="card next-action-card">
                <div className="card-header">
                  <div className="card-icon-bubble icon-amber">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                    </svg>
                  </div>
                  <div className="card-header-titles">
                    <h3>Recommended Action</h3>
                    <p className="card-subtitle">What you should do next</p>
                  </div>
                </div>

                <div className="action-recommendation-box">
                  <p>{caseData.nextAction}</p>
                </div>
              </section>
            </div>

            {/* Right Column: Timeline + Evidence */}
            <div className="grid-column column-right">
              {/* Timeline Section */}
              <section className="card timeline-card">
                <div className="card-header">
                  <div className="card-icon-bubble icon-emerald">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div className="card-header-titles">
                    <h3>Activity Timeline</h3>
                    <p className="card-subtitle">Historical case record</p>
                  </div>
                </div>

                {caseData.timeline.length === 0 ? (
                  <p className="empty-state">No events recorded yet.</p>
                ) : (
                  <div className="timeline-stepper">
                    {caseData.timeline.map((event, index) => (
                      <article key={event.id} className="timeline-item">
                        <div className="timeline-marker">
                          <div className="timeline-dot"></div>
                          {index < caseData.timeline.length - 1 && <div className="timeline-line"></div>}
                        </div>
                        <div className="timeline-body">
                          <span className="timeline-date">{event.date}</span>
                          <strong className="timeline-title">{event.title}</strong>
                          <p className="timeline-desc">{event.description}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              {/* Evidence Section */}
              <section className="card evidence-card">
                <div className="card-header">
                  <div className="card-icon-bubble icon-indigo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div className="card-header-titles">
                    <h3>Supporting Evidence</h3>
                    <p className="card-subtitle">Verified documents & files</p>
                  </div>
                </div>

                {caseData.evidence.length === 0 ? (
                  <p className="empty-state">No evidence has been added.</p>
                ) : (
                  <div className="evidence-list">
                    {caseData.evidence.map((item) => (
                      <div key={item.id} className="evidence-item">
                        <div className="evidence-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                        </div>
                        <span className="evidence-name">{item.name}</span>
                        <span className="evidence-badge">Verified</span>
                      </div>
                    ))}
                  </div>
                )}

                <button type="button" className="btn btn-outline add-evidence-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span>Add Evidence</span>
                </button>
              </section>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="dashboard-footer">
            <button
              onClick={handleNewApplication}
              className="btn btn-ghost track-another-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              <span>Track Another Application</span>
            </button>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;