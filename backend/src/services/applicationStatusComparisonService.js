/**
 * Application Status Comparison Service
 * Pure functional service to compare local application data with external status.
 */

const compareApplicationStatus = (localApplication, externalApplication) => {
  if (!localApplication || !externalApplication) {
    throw new Error("Both local and external application objects are required for comparison.");
  }

  const localStatus = localApplication.status || "";
  const externalStatus = externalApplication.status || "";

  const statusChanged = localStatus.toUpperCase() !== externalStatus.toUpperCase();

  // Timestamp comparison
  let externalIsNewer = null;

  const localDateRaw = localApplication.lastUpdated || localApplication.updatedAt || localApplication.submittedDate;
  const externalDateRaw = externalApplication.lastUpdated || externalApplication.updatedAt || externalApplication.submittedDate;

  if (localDateRaw && externalDateRaw) {
    const localTime = new Date(localDateRaw).getTime();
    const externalTime = new Date(externalDateRaw).getTime();

    if (!isNaN(localTime) && !isNaN(externalTime)) {
      externalIsNewer = externalTime > localTime;
    }
  }

  let message = "";
  if (statusChanged) {
    message = `The external service reports a different application status: ${localStatus} → ${externalStatus}.`;
  } else {
    message = "The latest external status matches the recorded application status.";
  }

  return {
    statusChanged,
    externalIsNewer,
    localStatus,
    externalStatus,
    message
  };
};

module.exports = {
  compareApplicationStatus
};
