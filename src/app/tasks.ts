export interface Task {
	id: string
	name: string
	icon: string
	color: string
}

export const TASKS: Task[] = [
	{id: "litter-box", name: "litter box", icon: "😸", color: "#6667ab"},
	{id: "sheets", name: "sheets", icon: "🛏️", color: "#f18aad"},
	{id: "wet-dry-vacuum", name: "wet/dry vacuum", icon: "🪣", color: "#ea6759"},
	{id: "vacuum", name: "vacuum", icon: "🧹", color: "#f88f58"},
	{id: "laundry", name: "laundry", icon: "🩲", color: "#f3c65f"},
	{id: "towels", name: "towels", icon: "🛀", color: "#8bc28c"},
]

export function getTask(id: string): Task | undefined {
	return TASKS.find(t => t.id === id)
}
