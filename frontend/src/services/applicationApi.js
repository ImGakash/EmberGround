const API_BASE_URL = "http://localhost:5000/api";

export const getApplication = async (applicationId) => {
  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationId)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to fetch application"
    );
  }

  return data;
};

export const getExternalApplicationStatus = async (applicationId) => {
  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationId)}/external-status`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to fetch external application status"
    );
  }

  return data;
};

export const getApplicationStatusComparison = async (applicationId) => {
  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationId)}/status-comparison`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to fetch application status comparison"
    );
  }

  return data;
};

export const syncApplication = async (applicationId) => {
  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationId)}/sync`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to synchronize application status"
    );
  }

  return data;
};

export const getApplicationTimeline = async (applicationId) => {
  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationId)}/timeline`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to fetch application timeline"
    );
  }

  return data;
};