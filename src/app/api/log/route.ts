import { NextRequest, NextResponse } from "next/server"
import { logTask } from "../../lib/googleTasks"

export async function POST(req: NextRequest) {
  try {
    const { taskId, taskName } = await req.json()

    if (!taskId || !taskName) {
      return NextResponse.json({ error: "Missing taskId or taskName" }, { status: 400 })
    }

    await logTask(taskId, taskName)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Google Tasks error:", err)
    return NextResponse.json({ error: "Failed to log task" }, { status: 500 })
  }
}
