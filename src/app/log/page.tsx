import {getTask} from "../tasks"
import ConfirmClient from "./ConfirmClient"

interface Props {
	searchParams: { task?: string }
}

export default function LogPage({searchParams}: Props) {
	const task = searchParams.task ? getTask(searchParams.task) : undefined

	const today = new Date().toLocaleDateString("en-US", {
		weekday: "long", month: "long", day: "numeric",
	})

	if (!task) {
		return (
			<main className="min-h-dvh flex items-center justify-center p-6">
				<div className="bg-white rounded-3xl px-8 py-10 max-w-md w-full text-center border border-[#e5e5e5]">
					<div className="text-5xl mb-4">🏠</div>
					<h1 className="text-xl font-semibold mb-2">No task found</h1>
				</div>
			</main>
		)
	}

	return <ConfirmClient task={task} today={today}/>
}