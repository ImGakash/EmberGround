import { useState } from "react";
import { getApplication } from "./services/api";
import "./App.css";

function App() {
  // ---------------------------------------
  // Application ID entered by the user
  // ---------------------------------------

  const [applicationId, setApplicationId] = useState("");

  // ---------------------------------------
  // Data received from backend
  // ---------------------------------------

  const [application, setApplication] = useState(null);

  // ---------------------------------------
  // UI states
  // ---------------------------------------

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------------------------------
  // Fetch application from backend
  // ---------------------------------------

  const handleTrackApplication = async () => {
    if (!applicationId.trim()) {
      setError("Please enter an application ID.");
      return;
    }

    setLoading(true);
    setError("");
    setApplication(null);

    try {
      const response = await getApplication(
        applicationId.trim()
      );

      setApplication(response.data);
    } catch (error) {
      setError(
        error.message || "Unable to fetch application."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // Start a new search
  // ---------------------------------------

  const handleNewSearch = () => {
    setApplicationId("");
    setApplication(null);
    setError("");
  };

  // ---------------------------------------
  // UI
  // ---------------------------------------

  return (
    <div className="app-container">
      {/* Background ambient light glow elements */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="app-header">
        <div className="logo-wrapper">
          <span className="logo-icon">🏛️</span>
          <h1 className="app-title">Nagrik</h1>
        </div>

        <p className="app-subtitle">
          Track your application and understand
          what happens next.
        </p>
      </header>


      {/* =====================================
          APPLICATION SEARCH
      ====================================== */}

      {!application && (
        <section className="search-card">

          <div className="card-header">
            <h2 className="card-title">Track an Application</h2>

            <p className="card-subtitle">
              Enter your application or reference ID
              to check its current status.
            </p>
          </div>

          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              value={applicationId}
              onChange={(event) =>
                setApplicationId(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleTrackApplication();
                }
              }}
              placeholder="Application / Reference ID"
            />

            <button
              className="search-btn"
              onClick={handleTrackApplication}
              disabled={loading}
            >
              {loading ? (
                <span className="btn-spinner-container">
                  <span className="spinner"></span>
                  Checking...
                </span>
              ) : (
                "Track Application"
              )}
            </button>
          </div>

          {/* Error */}

          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <p className="error-text">
                {error}
              </p>
            </div>
          )}

        </section>
      )}


      {/* =====================================
          APPLICATION RESULT
      ====================================== */}

      {application && (
        <main className="result-container">

          {/* ---------------------------------
              BASIC APPLICATION INFORMATION
          ---------------------------------- */}

          <section className="info-card">

            <div className="info-card-header">
              <div>
                <span className="badge-tag">Official Record</span>
                <h2 className="service-title">
                  {application.serviceName ||
                    "Application"}
                </h2>
              </div>

              <div className="status-badge-container">
                <span className="status-pill">
                  {application.status}
                </span>
              </div>
            </div>

            <div className="meta-grid">
              <div className="meta-item">
                <span className="meta-label">Application ID</span>
                <span className="meta-value mono">
                  {application.applicationId}
                </span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Current Status</span>
                <span className="meta-value highlight">
                  {application.status}
                </span>
              </div>

              {application.submittedDate && (
                <div className="meta-item">
                  <span className="meta-label">Submitted</span>
                  <span className="meta-value">
                    {application.submittedDate}
                  </span>
                </div>
              )}

              {application.lastUpdated && (
                <div className="meta-item">
                  <span className="meta-label">Last Updated</span>
                  <span className="meta-value">
                    {application.lastUpdated}
                  </span>
                </div>
              )}
            </div>

          </section>


          {/* ---------------------------------
              NAGRIK STATUS ANALYSIS
          ---------------------------------- */}

          {application.intelligence && (
            <section className="intelligence-card">

              <div className="intelligence-header">
                <div className="ai-badge">
                  <span className="ai-sparkle">✨</span> Nagrik Analysis
                </div>
                <h2>Nagrik Analysis</h2>
              </div>

              {/* Status */}

              <div className="status-overview-box">

                <h3 className="status-overview-label">
                  {application.intelligence.statusLabel}
                </h3>

                <p className="status-overview-msg">
                  {application.intelligence.message}
                </p>

              </div>


              {/* ---------------------------------
                  PROCESSING INFORMATION
              ---------------------------------- */}

              <div className="processing-section">

                <h3 className="section-subtitle">
                  Processing Information
                </h3>

                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-label">Processing days</span>
                    <span className="stat-number">
                      {application.intelligence.processingDays}
                    </span>
                    <span className="stat-unit">days</span>
                  </div>

                  <div className="stat-card">
                    <span className="stat-label">Expected processing days</span>
                    <span className="stat-number">
                      {application.intelligence.expectedDays}
                    </span>
                    <span className="stat-unit">days</span>
                  </div>

                  <div className="stat-card highlight-stat">
                    <span className="stat-label">Days remaining</span>
                    <span className="stat-number remaining">
                      {application.intelligence.daysRemaining}
                    </span>
                    <span className="stat-unit">days</span>
                  </div>
                </div>

              </div>


              {/* ---------------------------------
                  WHAT NAGRIK UNDERSTANDS
              ---------------------------------- */}

              <div className="understanding-box">

                <h3 className="section-subtitle">
                  <span>💡</span> What Nagrik understands
                </h3>

                <p className="case-summary">
                  {
                    application.intelligence
                      .caseSummary
                  }
                </p>

                {application.intelligence.reason && (
                  <p className="reason-callout">
                    {
                      application.intelligence
                        .reason
                    }
                  </p>
                )}

              </div>


              {/* ---------------------------------
                  RECOMMENDED ACTION
              ---------------------------------- */}

              <div className="action-box">

                <h3 className="section-subtitle">
                  <span>🎯</span> What you can do
                </h3>

                <p className="action-text">
                  {
                    application.intelligence
                      .recommendedAction
                  }
                </p>

              </div>

            </section>
          )}


          {/* ---------------------------------
              NEW SEARCH
          ---------------------------------- */}

          <section className="actions-section">

            <button
              className="new-search-btn"
              onClick={handleNewSearch}
            >
              Track Another Application
            </button>

          </section>

        </main>
      )}

    </div>
  );
}

export default App;