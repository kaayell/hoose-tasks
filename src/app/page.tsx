import Link from "next/link"
import { TASKS, getTask } from "./tasks"
import { getRecentLogs } from "./lib/googleTasks"

export default async function Home() {
  let recentLogs: Awaited<ReturnType<typeof getRecentLogs>> = []
  try {
    recentLogs = await getRecentLogs()
  } catch {
    // silently skip if Google Tasks is unavailable
  }

  return (
    <main className="max-w-md mx-auto px-5 py-8">
      <h1 className="text-[22px] font-semibold mb-2">Task Tracker</h1>
      <p className="text-[15px] text-[#666] mb-8">
        Tap an NFC tag or choose a task below to log a completion.
      </p>
      <div className="flex flex-row flex-wrap gap-2 justify-center">
        {TASKS.map(task => (
          <Link
            key={task.id}
            href={`/log?task=${task.id}`}
            className="flex flex-col items-center gap-1.5 px-2.5 py-2.5 rounded-full no-underline text-white"
            style={{ background: task.color }}
          >
            <span className="text-xs font-medium">{task.icon} {task.name}</span>
          </Link>
        ))}
      </div>
      {recentLogs.length > 0 && (
        <div className="mt-10">
          <h2 className="text-[15px] font-semibold text-[#444] mb-3">
            Recently completed
          </h2>
          <div className="flex flex-col gap-2">
            {recentLogs.map((log, i) => {
              const date = new Date(log.completedAt)
              const label = date.toLocaleString(undefined, {
                month: "short", day: "numeric", year: "2-digit",
                hour: "numeric", minute: "2-digit",
              })
              const task = log.taskId ? getTask(log.taskId) : undefined
              return (
                <div
                  key={i}
                  className="flex justify-between items-center rounded-xl px-4 py-3 border border-[#ececec]"
                  style={{ background: task ? task.color : "#f9f9f9" }}
                >
                  <span className="text-sm text-[#222]">{log.title}</span>
                  <span className="text-xs text-[#999] whitespace-nowrap ml-3">
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