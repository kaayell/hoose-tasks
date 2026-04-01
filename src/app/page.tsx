import Link from "next/link"
import { TASKS } from "./tasks"
import { getRecentLogs } from "./lib/googleTasks"

export default async function Home() {
  let recentLogs: Awaited<ReturnType<typeof getRecentLogs>> = []
  try {
    recentLogs = await getRecentLogs(10)
  } catch {
    // silently skip if Google Tasks is unavailable
  }

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "2rem 1.25rem" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Task Tracker</h1>
      <p style={{ fontSize: 15, color: "#666", marginBottom: 32 }}>
        Tap an NFC tag or choose a task below to log a completion.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TASKS.map(task => (
          <Link
            key={task.id}
            href={`/log?task=${task.id}`}
            style={{
              display: "flex", alignItems: "center", gap: 16,
              background: "#fff", borderRadius: 16, padding: "18px 20px",
              border: "1px solid #e5e5e5", textDecoration: "none", color: "inherit",
            }}
          >
            <span style={{ fontSize: 28 }}>{task.icon}</span>
            <span style={{ fontSize: 16, fontWeight: 500 }}>{task.name}</span>
          </Link>
        ))}
      </div>
      {recentLogs.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#444", marginBottom: 12 }}>
            Recently completed
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentLogs.map((log, i) => {
              const date = new Date(log.completedAt)
              const label = date.toLocaleString(undefined, {
                month: "short", day: "numeric", year: "2-digit",
                hour: "numeric", minute: "2-digit",
              })
              return (
                <div
                  key={i}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#f9f9f9", borderRadius: 12, padding: "12px 16px",
                    border: "1px solid #ececec",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#222" }}>{log.title}</span>
                  <span style={{ fontSize: 12, color: "#999", whiteSpace: "nowrap", marginLeft: 12 }}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}