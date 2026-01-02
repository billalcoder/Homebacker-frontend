export function logToServer(message, extra = {}) {
  fetch(`${import.meta.env.VITE_BASEURL}/log/frontend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      extra,
      url: window.location.href,
      userAgent: navigator.userAgent,
      time: new Date().toISOString()
    })
  });
}
