const analyzeApplication = (application) => {
  const now = new Date();

  const submittedDate = new Date(
    application.submittedDate
  );

  const processingDays = Math.max(
    0,
    Math.floor(
      (now - submittedDate) /
        (1000 * 60 * 60 * 24)
    )
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
  let actionType = "WAIT";

  /*
   * 1. ACTION REQUIRED
   */

  if (application.status === "ACTION_REQUIRED") {
    delayStatus = "ACTION_REQUIRED";
    statusLabel = "Action Required";
    severity = "HIGH";

    message =
      `Your ${application.serviceName} application requires your attention.`;

    reason =
      "The application indicates that additional action or information may be required.";

    recommendedAction =
      application.requiredAction ||
      "Check the application details and complete any required action.";

    actionType = "TAKE_REQUIRED_ACTION";

    caseSummary =
      `Your ${application.serviceName} application requires attention before processing can continue.`;
  }

  /*
   * 2. APPROVED / COMPLETED
   */

  else if (
    application.status === "APPROVED" ||
    application.status === "COMPLETED"
  ) {
    delayStatus = "COMPLETED";
    statusLabel = "Completed";
    severity = "LOW";

    message =
      `Your ${application.serviceName} application has completed processing.`;

    reason =
      "The application has reached a completed processing state.";

    recommendedAction =
      "No further action is currently required.";

    actionType = "NO_ACTION";

    caseSummary =
      `Your ${application.serviceName} application has completed processing.`;
  }

  /*
   * 3. REJECTED
   */

  else if (application.status === "REJECTED") {
    delayStatus = "ACTION_REQUIRED";
    statusLabel = "Action Required";
    severity = "HIGH";

    message =
      `Your ${application.serviceName} application has been rejected.`;

    reason =
      "The current application status indicates that processing did not result in approval.";

    recommendedAction =
      "Review the official rejection information and determine whether a correction, reapplication, or available review process is appropriate.";

    actionType = "REVIEW_DECISION";

    caseSummary =
      `Your ${application.serviceName} application is currently marked as rejected.`;
  }

  /*
   * 4. DELAYED
   */

  else if (processingDays > expectedDays) {
    delayStatus = "DELAYED";
    statusLabel = "Delayed";
    severity = "HIGH";

    const delayedBy =
      processingDays - expectedDays;

    message =
      `Your application has exceeded the expected processing time by ${delayedBy} days.`;

    reason =
      "The application has remained in processing longer than the expected timeline.";

    recommendedAction =
      "Check the official application status and contact the relevant service channel if no update is available.";

    actionType = "FOLLOW_UP";

    caseSummary =
      `Your ${application.serviceName} application has been under processing for ${processingDays} days, which is ${delayedBy} days beyond the expected processing time.`;
  }

  /*
   * 5. APPROACHING DEADLINE
   */

  else if (
    expectedDays > 0 &&
    processingDays >= expectedDays - 3
  ) {
    delayStatus = "APPROACHING_DEADLINE";
    statusLabel = "Approaching Deadline";
    severity = "MEDIUM";

    message =
      "Your application is approaching its expected processing timeline.";

    reason =
      "The application is still within the expected timeline but is close to the expected processing period.";

    recommendedAction =
      "Continue monitoring the application for an update.";

    actionType = "MONITOR";

    caseSummary =
      `Your ${application.serviceName} application is being processed and is approximately ${daysRemaining} days from its expected processing timeline.`;
  }

  /*
   * 6. ON TIME
   */

  else {
    delayStatus = "ON_TIME";
    statusLabel = "On Time";
    severity = "LOW";

    message =
      "Your application is currently being processed within the expected timeline.";

    reason =
      "The application is currently within the expected processing period.";

    recommendedAction =
      "Continue monitoring your application for the next update.";

    actionType = "MONITOR";

    caseSummary =
      `Your ${application.serviceName} application is currently within the expected processing timeline, with approximately ${daysRemaining} days remaining.`;
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

    nextAction: {
      type: actionType,
      title: recommendedAction
    }
  };
};

module.exports = {
  analyzeApplication
};