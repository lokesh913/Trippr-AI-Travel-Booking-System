/**
 * Trippr — API Helper Functions
 * Handles communication with the FastAPI backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * Check backend health.
 * @returns {Promise<{status: string, agents: number}>}
 */
export async function checkHealth() {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  if (!res.ok) throw new Error("Backend is not reachable");
  return res.json();
}

/**
 * Start a plan generation stream via SSE.
 * Returns the raw Response so the caller can consume the ReadableStream.
 *
 * @param {string} userQuery — The travel query
 * @param {string} threadId  — The session / thread ID
 * @returns {Promise<Response>}
 */
export async function generatePlanStream(userQuery, threadId) {
  const res = await fetch(`${API_BASE_URL}/api/generate-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_query: userQuery,
      thread_id: threadId,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API error ${res.status}: ${errorBody}`);
  }

  return res;
}
