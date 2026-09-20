// The token is a bearer credential. Never log it or include it in a URL.
const KEY = "wanderlock.session";
export const readSaved = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};
export function saveLocal(value) {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export class ApiError extends Error {
  constructor(message, status = 0, code = "NETWORK") {
    super(message);
    this.status = status;
    this.code = code;
  }
}
export async function api(path, { token, body, method } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`/api${path}`, {
      method: method || (body ? "POST" : "GET"),
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    let data;
    try {
      data = await response.json();
    } catch {
      throw new ApiError(
        "The server is waking up or unavailable. Please retry.",
        503,
      );
    }
    if (!response.ok)
      throw new ApiError(
        data.error?.message || "Please try again.",
        response.status,
        data.error?.code,
      );
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "Could not reach the server. Your answer is kept. Check your connection and retry.",
    );
  } finally {
    clearTimeout(timer);
  }
}
