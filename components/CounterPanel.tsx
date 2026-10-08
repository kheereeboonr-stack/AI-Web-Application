"use client";
import { useState, useEffect } from "react";

export function CounterPanel() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem("count");
    if (saved) setCount(Number(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("count", String(count));
  }, [count]);

  return (
    <section className="flex flex-col items-center gap-4 rounded-2xl border p-6">
      <h2>Counter</h2>
      <p className="text-7xl font-bold">{count}</p>
      <label className="flex items-center gap-2">
        ขั้นละ
        <input
          type="number"
          min={1}
          value={step}
          onChange={(e) => setStep(Math.max(1, Number(e.target.value)))}
          className="w-20 rounded border px-2 py-1 text-black"
        />
      </label>
      <div className="flex gap-3">
        <button onClick={() => setCount((c) => Math.max(0, c - step))}>−</button>
        <button onClick={() => setCount((c) => c + step)}>+</button>
        <button onClick={() => setCount(0)}>รีเซ็ต</button>
      </div>
    </section>
  );
}