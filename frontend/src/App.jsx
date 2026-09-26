import { useState } from "react";
import {
  getApplication,
  getExternalApplicationStatus,
  getApplicationStatusComparison,
  syncApplication,
  getApplicationTimeline
} from "./services/applicationApi";
import { SEEDED_APPLICATIONS } from "./config/seededApplications";
import "./App.css";

function App() {
  const [applicationId, setApplicationId] = useState("");
  const [data, setData] = useState(null);
  const [externalStatus, setExternalStatus] = useState(null);
  const [statusComparison, setStatusComparison] = useState(null);
  const [timelineHistory, setTimelineHistory] = useState([]);
  const [externalError, setExternalError] = useState("");
  const [syncNotice, setSyncNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const fetchApplicationData = async (targetId) => {
    const trimmedId = targetId.trim();

    if (!trimmedId) {
      setError("Please enter a valid Application or Reference ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setExternalError("");
      setSyncNotice("");
      setData(null);
      setExternalStatus(null);
      setStatusComparison(null);
      setTimelineHistory([]);

      // 1. Fetch local application data
      const localResponse = await getApplication(trimmedId);
      setData(localResponse.data);

      // 2. Fetch external status
      try {
        const externalResponse = await getExternalApplicationStatus(trimmedId);
        setExternalStatus(externalResponse.data);
      } catch (extErr) {
        console.warn("External status lookup notice:", extErr.message);
        setExternalError("Latest external status could not be retrieved.");
      }

      // 3. Fetch status comparison
      try {
        const comparisonResponse = await getApplicationStatusComparison(trimmedId);
        setStatusComparison(comparisonResponse.data);
      } catch (compErr) {
        console.warn("Status comparison lookup notice:", compErr.message);
        setStatusComparison(null);
      }

      // 4. Fetch timeline history
      try {
        const timelineResponse = await getApplicationTimeline(trimmedId);
        setTimelineHistory(timelineResponse.data.timeline || []);
      } catch (tlErr) {
        console.warn("Timeline lookup notice:", tlErr.message);
        setTimelineHistory([]);
      }
    } catch (err) {
      setError(
        err.message || "Unable to retrieve application. Please verify the Application ID."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!data || !data.application || !data.application.applicationId) return;

    try {
      setSyncing(true);
      setSyncNotice("");

      const response = await syncApplication(data.application.applicationId);

      setExternalStatus(response.data.external);
      setStatusComparison({ comparison: response.data.comparison });

      if (Array.isArray(response.data.history) && response.data.history.length > 0) {
        const updatedTimeline = response.data.history.map((item) => ({
          status: item.status,
          source: item.source,
          timestamp: item.timestamp,
          remarks: item.remarks || ""
        }));
        updatedTimeline.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setTimelineHistory(updatedTimeline);
      }

      setSyncNotice(response.data.sync?.message || "Synchronization completed.");
    } catch (err) {
      console.warn("Sync failed:", err.message);
      setSyncNotice("Synchronization failed. Latest external status could not be recorded.");
    } finally {
      setSyncing(false);
    }
  };

  const handleTrackApplication = (event) => {
    event.preventDefault();
    fetchApplicationData(applicationId);
  };

  const handleQuickSeedSelect = (id) => {
    setApplicationId(id);
    fetchApplicationData(id);
  };

  const handleTrackAnother = () => {
    setApplicationId("");
    setData(null);
    setExternalStatus(null);
    setStatusComparison(null);
    setTimelineHistory([]);
    setExternalError("");
    setSyncNotice("");
    setError("");
  };

  /*
   * Format helper for status CSS classes
   */
  const getStatusClass = (status) => {
    if (!status) return "submitted";
    return status.toLowerCase().replace(/[^a-z0-9]/g, "_");
  };

  /*
   * Format date helper
   */
  const formatDate = (value) => {
    if (!value) return "Not available";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not available";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="app-layout">
      {/* Background ambient glow effects */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* App Header */}
      <header className="app-header">
        <div className="logo-badge">
          <span className="logo-icon">🏛️</span>
          <span className="logo-text">Nagrik Portal</span>
        </div>
        <h1 className="app-title">Application Intelligence</h1>
        <p className="app-subtitle">
          Track official government application status with intelligent real-time insights and processing estimates.
        </p>
      </header>

      <main>
        {/* Initial Search Screen / Quick Seed Selector */}
        {(!data || loading) && (
          <section className="search-card">
            <div className="search-card-header">
              <h2 className="search-card-title">Track Your Application</h2>
              <p className="search-card-subtitle">
                Enter your application reference ID to view real-time processing status and intelligence insights.
              </p>
            </div>

            <form className="search-form" onSubmit={handleTrackApplication}>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  placeholder="e.g. NGR-APP-001"
                  disabled={loading}
                />
                <button type="submit" className="search-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="btn-spinner"></span>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <span>Track Status</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="error-banner" role="alert">
                  <span className="error-icon">⚠️</span>
                  <div className="error-content">
                    <span className="error-title">Application Lookup Failed</span>
                    <span className="error-text">{error}</span>
                  </div>
                </div>
              )}
            </form>

            <div className="quick-seeds-container">
              <span className="quick-seeds-label">Quick Test Seeded Records:</span>
              <div className="quick-seeds-list">
                {SEEDED_APPLICATIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="seed-chip"
                    onClick={() => handleQuickSeedSelect(item.id)}
                    disabled={loading}
                  >
                    <span>{item.id}</span>
                    <span className={`seed-chip-tag ${item.tagClass}`}>
                      {item.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="loading-card">
            <div className="loading-spinner-wrapper">
              <div className="loading-spinner-ring"></div>
              <span className="loading-spinner-icon">🔍</span>
            </div>
            <h2 className="loading-title">Retrieving Application Records...</h2>
            <p className="loading-text">
              Connecting to Nagrik backend and performing status tracking setup.
            </p>
          </div>
        )}

        {/* Application Data View */}
        {data && !loading && (
          <div className="results-container">
            {/* 1. Official Record Card (Local DB) */}
            <section className="card-section record-card">
              <div className="record-header">
                <div className="record-title-group">
                  <span className="badge-tag">Local Record</span>
                  <h2 className="service-name">{data.application.serviceName}</h2>
                </div>
                <div className={`status-pill ${getStatusClass(data.application.status)}`}>
                  <span className="status-pill-dot"></span>
                  <span>{data.application.status.replace(/_/g, " ")}</span>
                </div>
              </div>

              <div className="meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Application ID</span>
                  <span className="meta-value mono">{data.application.applicationId}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Date Submitted</span>
                  <span className="meta-value">{formatDate(data.application.submittedDate)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Last Updated</span>
                  <span className="meta-value">{formatDate(data.application.lastUpdated)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Expected Processing</span>
                  <span className="meta-value">{data.application.expectedDays} Days</span>
                </div>
              </div>
            </section>

            {/* 2. Latest External Status Card */}
            <section className="card-section record-card">
              <div className="record-header">
                <div className="record-title-group">
                  <span className="badge-tag">Latest External Status</span>
                  <h2 className="service-name">
                    {externalStatus ? externalStatus.serviceName : "External Service Status"}
                  </h2>
                </div>
                {externalStatus && (
                  <div className={`status-pill ${getStatusClass(externalStatus.status)}`}>
                    <span className="status-pill-dot"></span>
                    <span>{externalStatus.status.replace(/_/g, " ")}</span>
                  </div>
                )}
              </div>

              {externalStatus ? (
                <div className="meta-grid">
                  <div className="meta-item">
                    <span className="meta-label">Application ID</span>
                    <span className="meta-value mono">{externalStatus.applicationId}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Source</span>
                    <span className="meta-value">{externalStatus.source}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Status</span>
                    <span className="meta-value">{externalStatus.status.replace(/_/g, " ")}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Last Updated</span>
                    <span className="meta-value">{formatDate(externalStatus.lastUpdated)}</span>
                  </div>
                  {externalStatus.remarks && (
                    <div className="meta-item full-width">
                      <span className="meta-label">Remarks</span>
                      <span className="meta-value">{externalStatus.remarks}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="error-banner" role="alert">
                  <span className="error-icon">ℹ️</span>
                  <div className="error-content">
                    <span className="error-title">External Status Notice</span>
                    <span className="error-text">
                      {externalError || "Latest external status could not be retrieved."}
                    </span>
                  </div>
                </div>
              )}

              {/* Explicit Synchronization Action */}
              <div className="sync-action-bar">
                <button
                  type="button"
                  className="sync-btn"
                  onClick={handleSync}
                  disabled={syncing}
                >
                  {syncing ? (
                    <>
                      <span className="btn-spinner"></span>
                      <span>Synchronizing...</span>
                    </>
                  ) : (
                    <>
                      <span>🔄 Check for Latest Update</span>
                    </>
                  )}
                </button>

                {syncNotice && (
                  <div className="sync-notice-banner">
                    {syncNotice}
                  </div>
                )}
              </div>
            </section>

            {/* 3. Status Comparison Section */}
            {statusComparison && statusComparison.comparison && (
              <section className="card-section record-card">
                <div className="record-header">
                  <div className="record-title-group">
                    <span className="badge-tag">Status Comparison</span>
                    <h2 className="service-name">Data Alignment Analysis</h2>
                  </div>
                </div>

                {statusComparison.comparison.statusChanged === false ? (
                  <div className="status-match-box">
                    <span>✓</span>
                    <span>The latest external status matches the recorded status.</span>
                  </div>
                ) : (
                  <div className="status-update-box">
                    <div className="status-update-title">
                      <span>⚡</span>
                      <span>Status Update Detected</span>
                    </div>

                    <div className="status-diff-grid">
                      <div className="status-diff-item">
                        <span className="status-diff-label">Recorded Status</span>
                        <span className="status-diff-value">
                          {statusComparison.comparison.localStatus}
                        </span>
                      </div>
                      <div className="status-diff-item">
                        <span className="status-diff-label">Latest External Status</span>
                        <span className="status-diff-value">
                          {statusComparison.comparison.externalStatus}
                        </span>
                      </div>
                    </div>

                    <p className="status-diff-message">
                      {statusComparison.comparison.message}
                    </p>

                    {statusComparison.comparison.externalIsNewer === true && (
                      <div className="recent-notice">
                        ℹ️ The external information is more recent than the recorded information.
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* 4. Nagrik Intelligence Card */}
            {data.intelligence && (
              <section className="card-section intelligence-card">
                <div className="intelligence-header">
                  <div className="ai-badge">
                    <span>✨</span>
                    <span>Nagrik Intelligence Engine</span>
                  </div>
                  <h2 className="intelligence-title">Smart Application Analysis</h2>
                </div>

                <div className="status-summary-box">
                  <span className="status-summary-label">{data.intelligence.statusLabel}</span>
                  <p className="status-summary-msg">{data.intelligence.message}</p>
                </div>

                <div>
                  <h3 className="section-heading">
                    <span>📊</span> Processing Metrics
                  </h3>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <span className="stat-label">Days Elapsed</span>
                      <span className="stat-number">{data.intelligence.processingDays}</span>
                      <span className="stat-unit">days since submission</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-label">Expected Time</span>
                      <span className="stat-number">{data.intelligence.expectedDays}</span>
                      <span className="stat-unit">standard processing</span>
                    </div>
                    <div className="stat-card remaining-card">
                      <span className="stat-label">Estimated Days Left</span>
                      <span className="stat-number emerald">{data.intelligence.daysRemaining}</span>
                      <span className="stat-unit">days remaining</span>
                    </div>
                  </div>
                </div>

                <div className="understanding-box">
                  <h3 className="section-heading">
                    <span>💡</span> Application Assessment
                  </h3>
                  <p className="case-summary">{data.intelligence.caseSummary}</p>
                  {data.intelligence.reason && (
                    <div className="reason-callout">
                      {data.intelligence.reason}
                    </div>
                  )}
                </div>

                {data.intelligence.nextAction && (
                  <div className="next-action-box">
                    <h3 className="next-action-title">
                      Recommended Next Step: {data.intelligence.nextAction.title}
                    </h3>
                    {data.intelligence.nextAction.type === "TAKE_REQUIRED_ACTION" && (
                      <p className="next-action-desc">
                        Please review the required action section below and submit any pending documentation or verification details.
                      </p>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* 5. Chronological Application Timeline */}
            <section className="card-section timeline-card">
              <h2 className="section-heading">
                <span>⏱️</span> Chronological Status History
              </h2>

              {(timelineHistory && timelineHistory.length > 0) || (data.timeline && data.timeline.length > 0) ? (
                <div className="timeline-tree">
                  {(timelineHistory.length > 0
                    ? timelineHistory
                    : data.timeline.map((item) => ({
                        status: item.status,
                        source: "local",
                        timestamp: item.date,
                        remarks: item.description || item.title || ""
                      }))
                  ).map((event, index) => (
                    <div key={`${event.status}-${event.timestamp}-${index}`} className="timeline-item">
                      <div className="timeline-node-dot">
                        <div className="timeline-node-inner"></div>
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-content-header">
                          <h3 className="timeline-event-title">{event.status.replace(/_/g, " ")}</h3>
                          <span className="timeline-event-date">{formatDate(event.timestamp)}</span>
                        </div>
                        <div className="timeline-event-status-badge">
                          Source: {event.source === "external" ? "External Observation" : "Local Record"}
                        </div>
                        {event.remarks && (
                          <p className="timeline-event-desc">{event.remarks}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="loading-text">No timeline history recorded yet.</p>
              )}
            </section>

            {/* 6. Required Action Callout (if any) */}
            {data.application.requiredAction && (
              <section className="card-section action-required-card">
                <div className="action-required-header">
                  <span>⚠️</span>
                  <h2 className="action-required-title">Action Required</h2>
                </div>
                <p className="action-required-text">{data.application.requiredAction}</p>
              </section>
            )}

            {/* 7. Monitoring Section */}
            <section className="card-section monitoring-card">
              <h2 className="monitoring-title">Continuous Status Monitoring</h2>
              <p className="monitoring-text">
                Last updated record: <strong>{formatDate(data.application.lastUpdated)}</strong>. Nagrik checks status updates periodically to provide updated insights.
              </p>
            </section>

            {/* 8. Track Another Application Button */}
            <div className="track-another-wrapper">
              <button type="button" className="track-another-btn" onClick={handleTrackAnother}>
                <span>←</span>
                <span>Track Another Application</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;