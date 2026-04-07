"use client"

import { useState } from "react"
import { Task } from "../tasks"

type State = "idle" | "loading" | "success" | "error"

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
    <main className="min-h-dvh flex items-center justify-center p-6"
          style={{ background: task ? task.color : "#f9f9f9" }}>
      <div className="bg-white rounded-3xl px-8 py-10 max-w-100 w-full text-center border border-[#e5e5e5]">
        {state === "success" && (
          <>
            <div className="text-[56px] mb-4">✅</div>
            <h1 className="text-[22px] font-semibold mb-2 text-[#2d7d46]">Logged!</h1>
            <p className="text-[15px] text-[#888]">
              <strong>{task.name}</strong> added to your tasks for {today}.
            </p>
            <a href="/" className="block mt-8 py-[18px] text-[17px] font-semibold bg-[#1a1a1a] text-white border-none rounded-[14px] no-underline leading-normal">
              Done
            </a>
          </>
        )}

        {state === "error" && (
          <>
            <div className="text-[56px] mb-4">⚠️</div>
            <h1 className="text-[22px] font-semibold mb-2 text-[#b91c1c]">Something went wrong</h1>
            <p className="text-sm text-[#888] mb-6">{errorMsg}</p>
            <button onClick={() => setState("idle")}
              className="w-full py-[18px] text-[17px] font-semibold bg-[#1a1a1a] text-white border-none rounded-[14px] cursor-pointer">
              Try again
            </button>
          </>
        )}

        {(state === "idle" || state === "loading") && (
          <>
            <div className="text-[56px] mb-4">{task.icon}</div>
            <p className="text-[13px] text-[#999] uppercase tracking-wide mb-1">Log completion</p>
            <h1 className="text-[22px] font-semibold mb-2">{task.name}</h1>
            <p className="text-sm text-[#888] mb-8">{today}</p>
            <button onClick={handleConfirm} disabled={state === "loading"}
              className="w-full py-[18px] text-[17px] font-semibold bg-[#1a1a1a] text-white border-none rounded-[14px] cursor-pointer disabled:opacity-50">
              {state === "loading" ? "Logging…" : "Confirm ✓"}
            </button>
            <a href="/" className="block mt-4 text-sm text-[#aaa] no-underline">Cancel</a>
          </>
        )}
      </div>
    </main>
  )
}