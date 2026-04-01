export interface Task {
  id: string
  name: string
  icon: string
}

export const TASKS: Task[] = [
  { id: "litter-box",   name: "litter box cleaned", icon: "😸" },
  { id: "sheets",  name: "sheets changed", icon: "🛏️" },
  { id: "wet-dry-vacuum", name: "wet/dry vacuum", icon: "🪣" },
  { id: "vacuum", name: "vacuum", icon: "🧹" },
  { id: "laundry", name: "laundry done", icon: "🩲" },
  { id: "towels", name: "towels washed", icon: "🛀" },
]

export function getTask(id: string): Task | undefined {
  return TASKS.find(t => t.id === id)
}
