const analyzeApplication = (application) => {
  const now = new Date();

  const submittedDate = new Date(application.submittedDate);

  const processingDays = Math.floor(
    (now - submittedDate) / (1000 * 60 * 60 * 24)
  );

  const expectedDays = application.expectedDays;

  const daysRemaining = Math.max(
    expectedDays - processingDays,
    0
  );

  let delayStatus = "ON_TIME";
  let statusLabel = "On Time";
  let severity = "LOW";

  let message = "";
  let reason = "";
  let caseSummary = "";
  let recommendedAction = "";

  // 1. ACTION REQUIRED
  if (application.status === "ACTION_REQUIRED") {
    delayStatus = "ACTION_REQUIRED";
    statusLabel = "Action Required";
    severity = "HIGH";

    message = `Action is required for your ${application.serviceName} application.`;

    reason =
      "The department has requested additional action or documentation.";

    recommendedAction =
      application.requiredAction ||
      "Please check your application details and complete the required action.";

    caseSummary = `Your ${application.serviceName} application requires your attention before processing can continue.`;
  }

  // 2. APPROVED / COMPLETED
  else if (
    application.status === "APPROVED" ||
    application.status === "COMPLETED"
  ) {
    delayStatus = "COMPLETED";
    statusLabel = "Completed";
    severity = "LOW";

    message = `Your ${application.serviceName} application has been processed successfully.`;

    reason =
      "The application has completed the required processing.";

    recommendedAction =
      "No further action is required.";

    caseSummary = `Your ${application.serviceName} application has been successfully processed.`;
  }

  // 3. DELAYED
  else if (processingDays > expectedDays) {
    delayStatus = "DELAYED";
    statusLabel = "Delayed";
    severity = "HIGH";

    const delayedBy = processingDays - expectedDays;

    message =
      `Your application has exceeded the expected processing time by ${delayedBy} days.`;

    reason =
      "The application has been under processing longer than the expected timeline.";

    recommendedAction =
      "Contact the concerned department or check for an update.";

    caseSummary =
      `Your ${application.serviceName} application has been under processing for ${processingDays} days, which is ${delayedBy} days beyond the expected processing time.`;
  }

  // 4. APPROACHING DEADLINE
  else if (processingDays >= expectedDays - 3) {
    delayStatus = "APPROACHING_DEADLINE";
    statusLabel = "Approaching Deadline";
    severity = "MEDIUM";

    message =
      "Your application is approaching its expected processing deadline.";

    reason =
      "The application is still within the expected timeline but is close to the deadline.";

    recommendedAction =
      "Continue monitoring your application for updates.";

    caseSummary =
      `Your ${application.serviceName} application is being processed and is approximately ${daysRemaining} days away from its expected deadline.`;
  }

  // 5. ON TIME
  else {
    delayStatus = "ON_TIME";
    statusLabel = "On Time";
    severity = "LOW";

    message =
      "Your application is currently being processed within the expected timeline.";

    reason =
      "The application is progressing within the expected processing period.";

    recommendedAction =
      "No action required. Please wait for the next update.";

    caseSummary =
      `Your ${application.serviceName} application is currently being processed within the expected timeline, with approximately ${daysRemaining} days remaining.`;
  }

  return {
    processingDays,
    expectedDays,
    daysRemaining,
    delayStatus,
    statusLabel,
    severity,
    message,
    reason,
    caseSummary,
    recommendedAction
  };
};

module.exports = {
  analyzeApplication
};