"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";

type CountRecord = {
  id: number;
  title: string;
  count_value: number;
  note: string | null;
  created_at: string;
};

export default function SavedCountsPage() {
  const [title, setTitle] = useState("");
  const [countValue, setCountValue] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<CountRecord[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/counters");
      if (!response.ok) throw new Error("GET failed");
      const data: { counters: CountRecord[] } = await response.json();
      setItems(data.counters);
      setError("");
    } catch {
      setError("Cannot load count history. Check PostgreSQL.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function clearForm() {
    setTitle("");
    setCountValue("");
    setNote("");
    setEditingId(null);
  }

  // ดึงค่าปัจจุบันจากตัวนับในหน้าแรก (localStorage key "count")
  function loadCurrentCount() {
    const saved = localStorage.getItem("count");
    setCountValue(saved ?? "0");
  }

  function edit(item: CountRecord) {
    setTitle(item.title);
    setCountValue(String(item.count_value));
    setNote(item.note || "");
    setEditingId(item.id);
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(countValue);
    if (!title.trim() || countValue.trim() === "") {
      setError("Title and Count are required.");
      return;
    }
    if (!Number.isInteger(value) || value < 0) {
      setError("Count must be a whole number (0 or more).");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    const isEdit = editingId !== null;

    try {
      const response = await fetch(
        isEdit ? `/api/counters/${editingId}` : "/api/counters",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, countValue: value, note }),
        }
      );

      if (!response.ok) throw new Error("Save failed");
      clearForm();
      await load();
      setMessage(isEdit ? "Count updated." : "Count saved.");
    } catch {
      setError("Cannot save count.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!window.confirm("Delete this record?")) return;
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/counters/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      if (editingId === id) clearForm();
      await load();
      setMessage("Record deleted.");
    } catch {
      setError("Cannot delete record.");
    }
  }

  return (
    <main className="sp-page">
      <header className="sp-hero">
        <div className="sp-container sp-hero-inner">
          <div>
            <p className="sp-eyebrow">AI APPLICATION DEVELOPMENT WEEK 6</p>
            <h1>Count History</h1>
            <p className="sp-intro">
              Save, review, and manage the counts you have recorded.
            </p>
          </div>
          <Link href="/" className="sp-back">
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="sp-container sp-layout">
        <section className="sp-panel sp-editor" aria-labelledby="form-title">
          <p className="sp-kicker">01 / COUNT EDITOR</p>
          <h2 id="form-title">
            {editingId === null ? "Save a count" : "Edit record"}
          </h2>
          <p className="sp-helper">
            Give each record a clear title so you can find it later.
          </p>

          <form className="sp-form" onSubmit={save}>
            <label htmlFor="title">
              Title <span aria-hidden="true">*</span>
            </label>
            <input
              id="title"
              value={title}
              maxLength={200}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Visitors at the entrance"
              required
            />

            <label htmlFor="count">
              Count <span aria-hidden="true">*</span>
            </label>
            <input
              id="count"
              type="number"
              min={0}
              step={1}
              value={countValue}
              onChange={(e) => setCountValue(e.target.value)}
              placeholder="Example: 25"
              required
            />
            <button
              type="button"
              className="sp-secondary"
              onClick={loadCurrentCount}
            >
              Use current counter value
            </button>

            <label htmlFor="note">
              Note <span className="sp-optional">Optional</span>
            </label>
            <input
              id="note"
              value={note}
              maxLength={100}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Example: Morning round"
            />

            <div className="sp-actions">
              <button type="submit" className="sp-primary" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId === null
                  ? "Save count"
                  : "Update record"}
              </button>
              {editingId !== null && (
                <button
                  type="button"
                  className="sp-secondary"
                  onClick={clearForm}
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>

          {error && (
            <p className="sp-feedback sp-error" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="sp-feedback sp-success" role="status">
              {message}
            </p>
          )}
        </section>

        <section className="sp-library" aria-labelledby="library-title">
          <div className="sp-library-head">
            <div>
              <p className="sp-kicker">02 / YOUR HISTORY</p>
              <h2 id="library-title">My count history</h2>
            </div>
            <span className="sp-count">{items.length} saved</span>
          </div>

          {loading && (
            <p className="sp-empty" role="status">
              Loading history...
            </p>
          )}

          {!loading && items.length === 0 && (
            <div className="sp-empty">
              <strong>No records yet</strong>
              <p>Your first count will appear here after you save it.</p>
            </div>
          )}

          <div className="sp-list">
            {!loading &&
              items.map((item) => (
                <article className="sp-item" key={item.id}>
                  <div className="sp-item-top">
                    <h3>{item.title}</h3>
                    <span className="sp-tag">{item.note || "General"}</span>
                  </div>
                  <p className="sp-prompt-text">
                    <strong>{item.count_value}</strong>
                  </p>
                  <p className="sp-helper">
                    {new Date(item.created_at).toLocaleString("th-TH")}
                  </p>
                  <div className="sp-item-actions">
                    <button type="button" onClick={() => edit(item)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="sp-delete"
                      onClick={() => void remove(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}