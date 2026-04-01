"use client"

import { useState } from "react"
import { Task } from "../tasks"

type State = "idle" | "loading" | "success" | "error"

const card: React.CSSProperties = {
  background: "#fff", borderRadius: 24, padding: "2.5rem 2rem",
  maxWidth: 400, width: "100%", textAlign: "center", border: "1px solid #e5e5e5",
}

const btn: React.CSSProperties = {
  width: "100%", padding: 18, fontSize: 17, fontWeight: 600,
  background: "#1a1a1a", color: "#fff", border: "none",
  borderRadius: 14, cursor: "pointer",
}

export default function ConfirmClient({ task, today }: { task: Task; today: string }) {
  const [state, setState] = useState<State>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleConfirm() {
    setState("loading")
    try {
      const res = await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.id, taskName: task.name }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to log")
      }
      setState("success")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong")
      setState("error")
    }
  }

  return (
    <main style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={card}>
        {state === "success" && (
          <>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, color: "#2d7d46" }}>Logged!</h1>
            <p style={{ fontSize: 15, color: "#888" }}>
              <strong>{task.name}</strong> added to your tasks for {today}.
            </p>
            <a href="/" style={{ ...btn, display: "block", marginTop: 32, textDecoration: "none", lineHeight: "normal", paddingTop: 18, paddingBottom: 18 }}>Done</a>
          </>
        )}

        {state === "error" && (
          <>
            <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
            <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, color: "#b91c1c" }}>Something went wrong</h1>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>{errorMsg}</p>
            <button onClick={() => setState("idle")} style={btn}>Try again</button>
          </>
        )}

        {(state === "idle" || state === "loading") && (
          <>
            <div style={{ fontSize: 56, marginBottom: 16 }}>{task.icon}</div>
            <p style={{ fontSize: 13, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
              Log completion
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>{task.name}</h1>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 32 }}>{today}</p>
            <button onClick={handleConfirm} disabled={state === "loading"} style={{ ...btn, opacity: state === "loading" ? 0.5 : 1 }}>
              {state === "loading" ? "Logging…" : "Confirm ✓"}
            </button>
            <a href="/" style={{ display: "block", marginTop: 16, fontSize: 14, color: "#aaa", textDecoration: "none" }}>Cancel</a>
          </>
        )}
      </div>
    </main>
  )
}
