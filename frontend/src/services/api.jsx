const API_BASE_URL = "http://localhost:5000";

export const getApplication = async (applicationId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/applications/${applicationId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch application");
  }

  return data;
};