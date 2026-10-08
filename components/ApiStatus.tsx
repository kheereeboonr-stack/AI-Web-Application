"use client";

import { useState } from "react";

export function ApiStatus() {
  const [status, setStatus] = useState<string>("Not checked");
  const [recordCount, setRecordCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function checkApi() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/counters");

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data: { counters: unknown[] } = await response.json();
      setStatus("Online");
      setRecordCount(data.counters.length);
    } catch {
      setStatus("Offline");
      setRecordCount(null);
      setError("Cannot connect to database. Check PostgreSQL.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="ux-card ux-status">
      <div className="ux-section-heading">
        <p className="ux-eyebrow">SYSTEM STATUS</p>
        <h2>Database Status</h2>
        <p className="ux-muted">Check the connection to PostgreSQL.</p>
      </div>

      <p>
        API Status: <strong>{status}</strong>
      </p>

      {recordCount !== null && (
        <p>
          Saved records: <strong>{recordCount}</strong>
        </p>
      )}

      <button
        type="button"
        className="ux-button"
        onClick={checkApi}
        disabled={loading}
      >
        {loading ? "Checking..." : "Check API"}
      </button>

      {error && (
        <div className="ux-error" role="alert" style={{ marginTop: "10px" }}>
          {error}
        </div>
      )}
    </section>
  );
}