import { google } from "googleapis"

function getTasksClient() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })
  return google.tasks({ version: "v1", auth })
}

export interface CompletedLog {
  title: string
  completedAt: string // ISO string
}

export async function getRecentLogs(limit = 10): Promise<CompletedLog[]> {
  const tasks = getTasksClient()
  const res = await tasks.tasks.list({
    tasklist: "@default",
    showCompleted: true,
    showHidden: true,
  })
  const items = res.data.items ?? []
  return items
    .filter(t => t.status === "completed" && t.completed)
    .sort((a, b) => new Date(b.completed!).getTime() - new Date(a.completed!).getTime())
    .slice(0, limit)
    .map(t => ({ title: t.title ?? "", completedAt: t.completed! }))
}

export async function logTask(taskId: string, taskName: string) {
  const tasks = getTasksClient()
  const today = new Date().toISOString().split("T")[0] + "T00:00:00.000Z"

  await tasks.tasks.insert({
    tasklist: "@default",
    requestBody: {
      title: taskName,
      notes: `Logged via NFC tag (id: ${taskId})`,
      status: "completed",
      due: today,
    },
  })
}
