import Link from "next/link"
import { TASKS, getTask } from "./tasks"
import { getRecentLogs } from "./lib/googleTasks"

export default async function Home() {
  let recentLogs: Awaited<ReturnType<typeof getRecentLogs>> = []
  try {
    recentLogs = await getRecentLogs(200)
  } catch {
    // silently skip if Google Tasks is unavailable
  }

  // Group logs by local date string YYYY-MM-DD
  const logsByDate = recentLogs.reduce<Record<string, typeof recentLogs>>((acc, log) => {
    const date = new Date(log.completedAt).toLocaleDateString("en-CA") // YYYY-MM-DD
    ;(acc[date] ??= []).push(log)
    return acc
  }, {})

  // Build calendar grid for current month
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDow = firstDay.getDay()
  const monthLabel = firstDay.toLocaleString(undefined, { month: "long", year: "numeric" })
  const todayStr = now.toLocaleDateString("en-CA")

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

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


      {/* Calendar */}
      <div className="mt-10">
        <h2 className="text-[15px] font-semibold text-[#444] mb-3">{monthLabel}</h2>
        <div className="grid grid-cols-7 gap-px text-center text-[11px] text-[#999] mb-1">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const logs = logsByDate[dateStr] ?? []
            const isToday = dateStr === todayStr

            return (
              <div
                key={i}
                className={`rounded-lg p-1 min-h-12 flex flex-col items-center gap-0.5 ${isToday ? "bg-[#f0f0f0] ring-1 ring-[#ccc]" : ""}`}
              >
                <span className={`text-[11px] font-medium ${isToday ? "text-[#333]" : "text-[#999]"}`}>{day}</span>
                <div className="flex flex-wrap justify-center gap-0.5">
                  {logs.map((log, j) => {
                    const task = log.taskId ? getTask(log.taskId) : undefined
                    return (
                      <span
                        key={j}
                        title={log.title}
                        className="w-2 h-2 rounded-full block"
                        style={{ background: task?.color ?? "#ccc" }}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
          {TASKS.map(task => (
            <div key={task.id} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full block" style={{ background: task.color }} />
              <span className="text-[11px] text-[#666]">{task.name}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}