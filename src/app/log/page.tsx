import { getTask, TASKS } from "../tasks"
import ConfirmClient from "./ConfirmClient"
import Link from "next/link"

interface Props {
  searchParams: { task?: string }
}

export default function LogPage({ searchParams }: Props) {
  const task = searchParams.task ? getTask(searchParams.task) : undefined

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  })

  if (!task) {
    return (
      <main style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: "2.5rem 2rem", maxWidth: 400, width: "100%", textAlign: "center", border: "1px solid #e5e5e5" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Choose a task</h1>
          <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>No task specified. Pick one below.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {TASKS.map(t => (
              <Link key={t.id} href={`/log?task=${t.id}`} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "14px 16px", borderRadius: 12,
                border: "1px solid #e5e5e5", textDecoration: "none", color: "inherit",
              }}>
                <span style={{ fontSize: 22 }}>{t.icon}</span>
                <span style={{ fontSize: 15 }}>{t.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return <ConfirmClient task={task} today={today} />
}
