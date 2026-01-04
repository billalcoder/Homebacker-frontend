import React, { useEffect, useState } from "react";
import { networkLogs } from "../utils/networkLogger";

export default function Network() {
  const [logs, setLogs] = useState([]);
  const [online, setOnline] = useState(navigator.onLine);
  const [connection, setConnection] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  // Network status
  useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine);
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);

    if (navigator.connection) {
      setConnection(navigator.connection);
    }

    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, []);

  // Read global network logs
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs([...networkLogs]);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>📡 Network Debug</h2>

      {/* Connection Info */}
      <div style={{ marginBottom: 16 }}>
        <p>
          <strong>Status:</strong>{" "}
          <span style={{ color: online ? "green" : "red" }}>
            {online ? "Online" : "Offline"}
          </span>
        </p>

        {connection && (
          <>
            <p><strong>Type:</strong> {connection.effectiveType}</p>
            <p><strong>Downlink:</strong> {connection.downlink} Mbps</p>
            <p><strong>RTT:</strong> {connection.rtt} ms</p>
          </>
        )}
      </div>

      <hr />

      <h3>📜 Requests Log</h3>

      {logs.length === 0 && (
        <p>No network activity yet. Trigger any action in the app.</p>
      )}

      {logs.map((log, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
            borderLeft: `6px solid ${log.ok ? "green" : "red"}`,
          }}
        >
          <p><strong>{log.method}</strong> {log.url}</p>
          <p>Status: {log.status}</p>
          <p>Time: {log.time} ms</p>
          <p>At: {log.at}</p>

          {log.error && (
            <p style={{ color: "red" }}>Error: {log.error}</p>
          )}

          {log.response && (
            <>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{ marginTop: 6 }}
              >
                {openIndex === i ? "Hide Response" : "View Response"}
              </button>

              {openIndex === i && (
                <pre
                  style={{
                    marginTop: 8,
                    background: "#f7f7f7",
                    padding: 10,
                    maxHeight: 220,
                    overflow: "auto",
                    fontSize: 12,
                  }}
                >
                  {typeof log.response === "object"
                    ? JSON.stringify(log.response, null, 2)
                    : log.response}
                </pre>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
