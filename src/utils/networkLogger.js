export const networkLogs = [];

const MAX_BODY_SIZE = 1500;

export function initNetworkLogger() {
  if (window.__NETWORK_LOGGER__) return;
  window.__NETWORK_LOGGER__ = true;

  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const start = performance.now();
    const url = args[0];
    const options = args[1] || {};
    const method = options.method || "GET";

    try {
      const res = await originalFetch(...args);
      const time = Math.round(performance.now() - start);

      let response = null;
      let responseType = "unknown";

      try {
        const clone = res.clone();
        const contentType = clone.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          responseType = "json";
          response = await clone.json();
        } else {
          responseType = "text";
          response = (await clone.text()).slice(0, MAX_BODY_SIZE);
        }
      } catch (e) {
        response = "⚠ Unable to read response";
      }

      networkLogs.unshift({
        url,
        method,
        status: res.status,
        ok: res.ok,
        time,
        response,
        responseType,
        at: new Date().toLocaleTimeString(),
      });

      return res;
    } catch (err) {
      const time = Math.round(performance.now() - start);

      networkLogs.unshift({
        url,
        method,
        status: "FAILED",
        ok: false,
        time,
        error: err.message,
        at: new Date().toLocaleTimeString(),
      });

      throw err;
    }
  };
}
